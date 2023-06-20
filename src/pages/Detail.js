import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { ReviewForm } from "../components/ReviewForm";
import { useParams } from "react-router-dom";

import { useContext, useState, useEffect } from "react";
import { FBDBContext } from "../contexts/FBDBContext";
import { FBStorageContext } from "../contexts/FBStorageContext";
import { FBAuthContext } from "../contexts/FBAuthContext";
// import { AuthContext } from "../contexts/AuthContext";

import { doc, getDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

export function Detail(props) {
  const [movieData, setMovieData] = useState();
  const [auth, setAuth] = useState();
  const [movieReviews, setMovieReviews] = useState([]);

  const { movieId } = useParams();

  const FBDB = useContext(FBDBContext);
  const FBStorage = useContext(FBStorageContext);
  const FBAuth = useContext(FBAuthContext);

  onAuthStateChanged(FBAuth, (user) => {
    if (user) {
      //user is signed in
      setAuth(user);
    } else {
      //user is not signed in
      setAuth(null);
    }
  });

  const getReviews = async () => {
    const path = `movies/${movieId}/reviews`;
    const querySnapshot = await getDocs(collection(FBDB, path));
    let reviews = [];
    querySnapshot.forEach((item) => {
      let review = item.data();
      review.id = item.id;
      reviews.push(review);
    });
    setMovieReviews(reviews);
  };

  const ReviewCollection = movieReviews.map((item) => {
    return (
      <Col md="3">
        <Card>
          <Card.Body>
            <Card.Title>
              <h5>{item.title}</h5>
            </Card.Title>
            <Card.Text>
              <p>{item.content}</p>
              <p>{item.stars} Star</p>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    );
  });

  const movieRef = doc(FBDB, "movies", movieId);

  const getMovie = async () => {
    let movie = await getDoc(movieRef);
    if (movie.exists()) {
      setMovieData(movie.data());
      getReviews();
    } else {
      // no movie exists with the ID
    }
  };

  useEffect(() => {
    if (!movieData) {
      getMovie(movieId);
    }
  });

  //function to handle review submission
  const reviewHandler = async (reviewData) => {
    //create a document inside firestore
    const path = `movies/${movieId}/reviews`;
    const review = await addDoc(collection(FBDB, path), reviewData);
    getReviews();
  };

  const Image = (props) => {
    const [imgPath, setImgPath] = useState();
    const imgRef = ref(FBStorage, `film_cover/${props.path}`);
    getDownloadURL(imgRef).then((url) => setImgPath(url));

    return <img src={imgPath} className="img-fluid" />;
  };

  if (movieData) {
    return (
      <Container>
        <Row className="my-3">
          <Col md="4">
            <Image path={movieData.cover} />
          </Col>
          <Col>
            <h1>{movieData.title}</h1>
            <h3>Directed by {movieData.director}</h3>
            <p>Published: {movieData.year}</p>
            <h4>Starring {movieData.mainActor}</h4>

            <p className="movie-summary">
              <strong>Story:</strong> <br /> {movieData.summary}
            </p>

            <h4>Produced by {movieData.producer}</h4>
            <p>
              IMDB : <a href={movieData.IMDB}>{movieData.IMDB}</a>{" "}
            </p>
          </Col>
        </Row>
        <Row className="my-3">
          <Col md="6">
            <ReviewForm user={auth} handler={reviewHandler} />
          </Col>
        </Row>
        <Row>{ReviewCollection}</Row>
      </Container>
    );
  } else {
    return (
      <Container>
        <Row>
          <Col>
            <h2>Loading...</h2>
          </Col>
        </Row>
      </Container>
    );
  }
}

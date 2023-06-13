import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";
import { ReviewForm } from "../components/ReviewForm";

import { useContext, useState, useEffect } from "react";
import { FBDBContext } from "../contexts/FBDBContext";
import { FBStorageContext } from "../contexts/FBStorageContext";
import { FBAuthContext } from "../contexts/FBAuthContext";

import { doc, getDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function Detail(props) {
  const [movieData, setMovieData] = useState();
  const [auth, setAuth] = useState();
  const [movieReviews, setMovieReviews] = useState([]);

  let { movieId } = useParams();

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

  const movieRef = doc(FBDB, "movies", movieId);

  const getMovie = async (id) => {
    let movie = await getDoc(movieRef);
    if (movie.exists()) {
      setMovieData(movie.data());
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
  };

  const Image = (props) => {
    const [imgPath, setImgPath] = useState();
    const imgRef = ref(FBStorage, `movie_cover/${props.path}`);
    getDownloadURL(imgRef).then((url) => setImgPath(url));

    return <img src={imgPath} className="img-fluid" />;
  };

  if (movieData) {
    return (
      <Container>
        <Row className="my-3">
          <Col md="4">
            <Image path={movieData.image} />
          </Col>
          <Col>
            <h2>{movieData.title}</h2>
            <h4>{movieData.director}</h4>
            <p>{movieData.year}</p>
            <p>{movieData.summary}</p>
            <p>IMDB :{movieData.IMDB} </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <ReviewForm user={auth} />
          </Col>
        </Row>
      </Container>
    );
  } else {
    return null;
  }
}

import "../styles/Home.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

import { FBDBContext } from "../contexts/FBDBContext";
import { FBStorageContext } from "../contexts/FBStorageContext";

export function Home() {
  const [data, setData] = useState([]);

  const FBDB = useContext(FBDBContext);
  const FBStorage = useContext(FBStorageContext);

  const getData = async () => {
    // get data from firestore collection called "movies"
    const querySnapshot = await getDocs(collection(FBDB, "movies"));
    // an array to store all the movies from firestore
    let movies = [];
    querySnapshot.forEach((doc) => {
      let movie = doc.data();
      movie.id = doc.id;
      // add the movie to the array
      movies.push(movie);
    });
    // set the movies array as the data state
    setData(movies);
  };

  useEffect(() => {
    if (data.length === 0) {
      getData();
    }
  });

  const Image = (props) => {
    const [imgPath, setImgPath] = useState();
    const imgRef = ref(FBStorage, `film_cover/${props.path}`);
    getDownloadURL(imgRef).then((url) => setImgPath(url));

    return <Card.Img variant="top" src={imgPath} className="card-image" />;
  };

  const Columns = data.map((movie, key) => {
    return (
      <Col md="4" key={key}>
        <Card className="movie-card">
          <Image path={movie.cover} />
          <Card.Body>
            <Card.Title>{movie.title}</Card.Title>
          </Card.Body>
          <a href={"/detail/" + movie.id} className="card-link"></a>
        </Card>
      </Col>
    );
  });

  return (
    <Container>
      Welcome to Film Stack Over View
      <Row>{Columns}</Row>
    </Container>
  );
}

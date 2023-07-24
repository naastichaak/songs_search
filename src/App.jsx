import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";

const CLIENT_ID = "9328dd6f81044500b19ecd05dc56aa91";
const CLIENT_SECRET = "b4859e00926844cab5f5f36e5004ec33";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [token, setToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // getting token
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setToken(data.access_token));
  }, []);

  async function search() {
    console.log("search for " + searchInput);

    //request to search artist ID
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    console.log("artist ID is " + artistID);

    // reques with artist ID for tracks
    var returnedAlbums = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&market=US&limit=50",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      });
  }

  console.log(albums);

  //   async function listen() {
  //     var albumID = await fetch(
  //       "https://api.spotify.com/v1/artists/" +
  //         artistID +
  //         "/albums" +
  //         "?include_groups=album&market=US&limit=50",
  //       searchParameters
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data.href);
  //       });

  //     //   var returnedLink = await fetch()
  //   }

  return (
    <div className="app">
      <Container className="mb-3 mt-3" size="lg">
        <InputGroup>
          <FormControl
            placeholder="Search for artist"
            type="input"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                search();
              }
            }}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="row row-cols-4">
          {albums.map((album, i, key) => {
            console.log(album);
            return (
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                  {/* <Button onClick={listen}>Listen</Button> */}
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}
export default App;

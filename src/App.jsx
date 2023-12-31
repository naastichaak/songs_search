import styles from "./App.module.css";

import { RotatingLines } from "react-loader-spinner";
import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
// //   Container,
// //   InputGroup,
//   FormControl,
// //   Button,
//   Row,
//   Card,
// } from "react-bootstrap";

const CLIENT_ID = "9328dd6f81044500b19ecd05dc56aa91";
const CLIENT_SECRET = "b4859e00926844cab5f5f36e5004ec33";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [token, setToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
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
      .then((data) => setToken(data.access_token))
      .finally(() => setLoading(false));
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

  function handleSearchSubmit(e) {
    e.preventDefault();
    search();
  }

  return (
    <div className="app">
      <RotatingLines
        strokeColor="grey"
        className={styles.spinner}
        // style={{ top: "50%", left: "50%" }}
        visible={loading}
      />
      <form onSubmit={handleSearchSubmit} className={styles.InputGroup}>
        <TextField
          className={styles.TextField}
          id="outlined-basic"
          variant="outlined"
          placeholder="Search for artist"
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Search
        </Button>
      </form>
      <List className={styles.Albums}>
        {albums.map((album, i) => {
          return (
            <ListItem className={styles.Alb}>
              <img className={styles.image} src={album.images[0].url} />
              <ListItemText className={styles.title}>{album.name}</ListItemText>
              <Button
                className={styles.ListenBtn}
                variant="contained"
                href={album.external_urls.spotify}
                target="_blank"
                rel="noreferrer noopener"
              >
                Listen
              </Button>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
export default App;

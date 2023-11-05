import { useState, useEffect } from "react";
// import { getGenreSeeds } from './util/Spotify';
import { Box, SimpleGrid } from "@chakra-ui/react";
import GenreCard from "./GenreCard";
import genresJson from "./static/genres.json";

const Genres = () => {
  const [genres, setGenres] = useState([]);

  const getAbbreviation = (genre) => {
    return `${genre.at(0).toUpperCase()}${genre.at(1)}`;
  };

  const generateAtomicNumber = () => {
    return Math.floor(Math.random() * 118) + 1;
  };

  const getColorFromClassification = (num) => {
    const classification = {
      alkaliMetal: [3, 11, 19, 37, 55, 87],
      alkalineEarthMetal: [4, 12, 20, 38, 56, 88],
      reactiveNonmetal: [1, 6, 7, 8, 9, 15, 16, 17, 34, 35, 53],
      nobleGas: [2, 10, 18, 36, 54, 86],
      transitionMetal: [
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 39, 40, 41, 42, 43, 44, 45, 46,
        47, 48, 72, 73, 74, 75, 76, 77, 78, 79, 80, 104, 105, 106, 107, 108,
      ],
      actinides: [
        89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
      ],
      postTransitionMetal: [13, 31, 49, 50, 81, 82, 83, 84, 85],
      metalloid: [5, 14, 32, 33, 51, 52],
      lanthanides: [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
      unknown: [109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
    };

    for (let key in classification) {
      if (classification[key].includes(num)) {
        switch (key) {
          case "alkaliMetal":
            return "teal";
          case "alkalineEarthMetal":
            return "red";
          case "reactiveNonmetal":
            return "blue";
          case "nobleGas":
            return "pink";
          case "transitionMetal":
            return "purple";
          case "actinides":
            return "orange";
          case "postTransitionMetal":
            return "green";
          case "metalloid":
            return "yellow";
          case "lanthanides":
            return "cyan";
          case "unknown":
            return "gray";
          default:
            return "gray";
        }
      }
    }
  };

  useEffect(() => {
    // getGenreSeeds().then((genres) => {
    //   const genreList = genres.map((genre) => {
    //     const atomicNum = generateAtomicNumber();
    //     return {
    //       name: genre,
    //       abbrev: getAbbreviation(genre),
    //       atomicNum: atomicNum,
    //       color: getColorFromClassification(atomicNum)
    //     }
    //   });
    //   setGenres(genreList);
    // });

    let genresList = genresJson.genres.map((genre) => {
      const atomicNum = generateAtomicNumber();
      return {
        name: genre,
        abbrev: getAbbreviation(genre),
        atomicNum: atomicNum,
        color: getColorFromClassification(atomicNum),
      };
    });
    setGenres(genresList);
  }, []);

  return (
    <SimpleGrid id="Genre-Top-Level" p={4} columns={[2, 3, null]} spacing={2}>
      {genres &&
        genres.map((genre, index) => {
          return (
            <GenreCard
              key={`${genre}${index}`}
              name={genre.name}
              abbrev={genre.abbrev}
              atomicNum={genre.atomicNum}
              color={genre.color}
            />
          );
        })}
    </SimpleGrid>
  );
};

export default Genres;

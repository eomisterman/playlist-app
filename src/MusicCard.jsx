import {
  Stack,
  Box,
  Flex,
  Center,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

const MusicCard = ({ type, name, detailList, images, handleClick, index }) => {
  const handleClickHeading = (e) => {
    e.preventDefault();
    console.log("The link was clicked.");
  };

  return (
    <Flex
      onClick={handleClick}
      my={1}
      direction={{ base: "row" }}
      variant={"elevated"}
      shadow={"md"}
      backgroundColor={"whiteAlpha.800"}
      maxH={"fit-content"}
      borderRadius={"md"}
      _hover={{ shadow: "lg", backgroundColor: "whiteAlpha.600" }}
    >
      <Center justifyContent="flex-start" alignItems="center" w="100%" h="100%">
        <Box minW={12}>
          <Text color={"gray.400"} fontSize={"sm"} textAlign={"right"} mr={5}>
            {index}
          </Text>
        </Box>
        <Image
          maxW={{ base: 10 }}
          minW={{ base: 10 }}
          maxH={{ base: 10 }}
          borderRadius={"full"}
          mr={5}
          src={images?.at(-1).url}
          alt="Album Image"
        />
        <Stack w={"full"}>
          <Box>
            <Flex noOfLines={1}>
              <Heading
                fontSize={"md"}
                fontWeight={"semibold"}
                as={"a"}
                noOfLines={1}
                onClick={handleClickHeading}
                _hover={{ textDecoration: "underline" }}
                w="fit-content"
              >
                {name}
              </Heading>
            </Flex>
            <Flex w="100%" noOfLines={1}>
              {detailList.map((detail, index) => {
                return type == "track" ? (
                  <Text key={detail.id} display={"inline"}>
                    <Text
                      id={detail.id}
                      fontSize={"sm"}
                      color={"gray.500"}
                      as={"button"}
                      _hover={{ textDecoration: "underline" }}
                    >{`${detail.name}`}</Text>
                    <span>{`${
                      index < detailList.length - 1 ? ", " : ""
                    }`}</span>
                  </Text>
                ) : (
                  <Text
                    key={detail}
                    fontSize={"sm"}
                    color={"gray.500"}
                    as={"button"}
                    _hover={{ textDecoration: "underline" }}
                  >
                    {`${index ? ", " : ""}${detail}`}
                  </Text>
                );
              })}
            </Flex>
          </Box>
        </Stack>
        <Box mx={3}>
          <FontAwesomeIcon icon={faPlus} />
        </Box>
      </Center>
    </Flex>
  );
};

MusicCard.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  detailList: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  handleClick: PropTypes.func,
};

export default MusicCard;

import { Flex, Text, Heading, Center } from "@chakra-ui/react";
import { PropTypes } from "prop-types";

const GenreCard = ({ name, color, abbrev, atomicNum }) => {
  return (
    <Flex
      backgroundColor={`${color}.100`}
      p={3}
      pb={2}
      h={40}
      w={36}
      flexDir={"column"}
      justifyContent={"space-between"}
      alignItems={"center"}
      borderRadius={"sm"}
      shadow={"sm"}
      _hover={{ shadow: "lg" }}
    >
      <Text color={`${color}.500`} alignSelf={"flex-start"}>
        {atomicNum}
      </Text>
      <Center h="100%">
        <Heading color={`${color}.500`} size={"4xl"}>
          {abbrev}
        </Heading>
      </Center>
      <Text color={`${color}.500`}>{name}</Text>
    </Flex>
  );
};

GenreCard.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  abbrev: PropTypes.string.isRequired,
  atomicNum: PropTypes.number.isRequired,
};

export default GenreCard;

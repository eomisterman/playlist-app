import { Flex, Box, Text, Heading, Center } from "@chakra-ui/react";
import { PropTypes } from "prop-types";

const GenreCard = ({name, color, abbrev, atomicNum}) => {
  return (
    <Flex
      backgroundColor={`${color}.100`}
      p={2}
      pb={2}
      h={32}
      w={28}
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
        <Heading color={`${color}.500`} fontSize={"5xl"}>
          {abbrev}
        </Heading>
      </Center>
      <Box textAlign={"center"}>
        <Text id="Genre-Name" color={`${color}.500`} fontSize={"xs"}>
          {name}
        </Text>
      </Box>
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

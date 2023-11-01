import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack
} from "@chakra-ui/react";
import { redirectToAuthCodeFlow } from "./util/Spotify";

const Login = () => {
  const handleSpotifyLogin = () => {
    redirectToAuthCodeFlow();
  };

  return (
    <Container minWidth={"100vw"}>
      <Stack
        as={Box}
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Welcome to <br />
          <Text as={"span"} color={"green.400"}>
            tracKemist
          </Text>
        </Heading>
        <Container>
          <Text color={"gray.500"}>
            This web app was made for all the people out there that find creating playlists in the Spotify app to be a massive headache. For those who have a vision and want an easier way to turn those ideas into playlists.
          </Text>
        </Container>
        <Stack
          direction={"column"}
          spacing={3}
          align={"center"}
          alignSelf={"center"}
          position={"relative"}
        >
          <Button
            colorScheme={"green"}
            bg={"green.400"}
            rounded={"full"}
            px={6}
            _hover={{
              bg: "green.500",
            }}
            onClick={handleSpotifyLogin}
          >
            Login with Spotify
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Login;
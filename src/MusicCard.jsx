import { Card, CardBody, Heading, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

const MusicCard = ({ type, name, detailList, handleClick }) => {
  return (
    <Card onClick={handleClick} my={1}>
      <CardBody>
        <Heading size={"sm"}>{name}</Heading>
        {detailList.map((detail, index) => {
          return type == "track" ? (
            <Text key={detail.id} display={"inline"}>{`${index ? ", " : ""}${
              detail.name
            }`}</Text>
          ) : (
            <Text key={detail}>
              `${index ? ", " : ""}${detail}`
            </Text>
          );
        })}
      </CardBody>
    </Card>
  );
};

MusicCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  detailList: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
};

export default MusicCard;

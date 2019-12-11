import React from "react";

import Feedcard from "./newsfeedcard";
import Context from "../usercontext";

export default function RecipeReviewCard(props) {
  const cuser = React.useContext(Context);
  let { item } = props;
  const [expanded, setExpanded] = React.useState(false);
  const [menuExpande, setMenuExpanded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [commentLoading, setCommentLoading] = React.useState(false);
  const [likesLoading, setLikesLoading] = React.useState(false);

  let newPublished;
  let espnPublished;
  try {
    if (props.cnn || props.fox) {
      let splittedPublished = item.published.split(",");

      let splittedDays = splittedPublished[0];
      let shortSplittedDays;
      if (splittedDays == "Sunday ") shortSplittedDays = "Sun";
      if (splittedDays == "Monday ") shortSplittedDays = "Mon";
      if (splittedDays == "Tuesday ") shortSplittedDays = "Tue";
      if (splittedDays == "Wednesday ") shortSplittedDays = "Wed";
      if (splittedDays == "Thrusday ") shortSplittedDays = "Thu";
      if (splittedDays == "Friday ") shortSplittedDays = "Fri";
      if (splittedDays == "Saturday ") shortSplittedDays = "Sat";

      let splittedDateTime = splittedPublished[1].split(" ");

      let splittedTime = splittedDateTime[3].split(":");

      newPublished = `${shortSplittedDays}, ${splittedDateTime[0]} ${
        splittedDateTime[1]
      } ${splittedDateTime[2]} ${splittedTime[0]}:${splittedTime[1]} ${
        splittedDateTime[4]
      }`;
    } else {
      let splittedPublished = item.published.split(" ");
      let splittedTime = splittedPublished[4].split(":");
      espnPublished = `${splittedPublished[0]} ${splittedPublished[1]} ${
        splittedPublished[2]
      } ${splittedPublished[3]} ${splittedTime[0]}:${splittedTime[1]} ${
        splittedPublished[5]
      }`;
    }
  } catch (err) {
    newPublished = item.published;
    espnPublished = item.published;
  }

  return (
    <Feedcard
      item={props.item}
      likes={props.likes}
      comments={props.comments}
      url={props.item.link}
      date={props.cnn || props.fox ? newPublished : espnPublished}
      letter={props.letter}
      title={props.item.title}
      media={props.item.media}
      description={props.item.summary}
      CREATE_LIKE_MUTATION={props.CREATE_LIKE_MUTATION}
      updateLikeFunction={props.updateLikeFunction}
      CREATE_COMMENT_MUTATION={props.CREATE_COMMENT_MUTATION}
      updateCommentFunction={props.updateCommentFunction}
    />
  );
}

/* const CREATE_LIKE_MUTATION = gql`
  mutation($tweetid: Int!) {
    createCnnLike(tweetId: $tweetid) {
      user {
        username

      }
      feed {
          id
      }
      likedordisliked
      likesid
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation($tweetid: Int!,$commenttext:String!) {
    createCnnComment(tweetId: $tweetid,commenttext:$commenttext ) {
     feed {
       id
     }
     commenttext
     commentid
    }
  }
`;
 */

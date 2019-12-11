import React from 'react';

import {Mutation} from 'react-apollo';

import {gql} from 'apollo-boost';

import {Context} from '../usercontext';

import Card from './card';

function Singletweet(props) {
  const cuser = React.useContext(Context);
  const [webview, showWebview] = React.useState(false);

  const handleDelete = async deleteTweet => {
    const res = await deleteTweet();
  };

  const handleReportAbuse = async reportAbuse => {
    const res = await reportAbuse();
  };

  let {item} = props;

  let temp = item.tweettime.split('T');
  let tweetdate = temp[0].split('-');

  let tweettime = temp[1].split('.')[0];
  let formatteDate = new Date(
    Number(tweetdate[0]),
    Number(tweetdate[1]) - 1,
    Number(tweetdate[2]),
  ).toDateString();
  let splittedFormatedDate = formatteDate.split(' ');
  formatteDate = `${splittedFormatedDate[0]}, ${splittedFormatedDate[1]} ${
    splittedFormatedDate[2]
  } ${splittedFormatedDate[3]}`;
  let splittedTweetTime = tweettime.split(':');
  let dateWithTime = `${formatteDate} ${splittedTweetTime[0]}:${
    splittedTweetTime[1]
  } EST`;

  let commentCount = item.comments.length;

  let text = item.tweettext;

  let linkindex = false;
  let lastindex = false;

  let linkcontent = '';
  if (text) {
    if (text.indexOf('http') > 0 || text.indexOf('www') > 0) {
      if (text.indexOf('http') > 0) {
        linkindex = text.indexOf('http');
        let templink = text.slice(linkindex, text.length);

        for (let i = 0; i < templink.length; i++) {
          if (templink[i] == ' ') {
            lastindex = linkindex + i;
            break;
          } else {
            linkcontent = linkcontent + templink[i];
          }
        }
      } else {
        linkindex = text.indexOf('www');
        let templink = text.slice(linkindex, text.length);

        for (let i = 0; i < templink.length; i++) {
          if (templink[i] == ' ') {
            lastindex = linkindex + i;
            break;
          } else {
            linkcontent = linkcontent + templink[i];
          }
        }
      }
    }
  }
  if (lastindex == false) {
    lastindex = text.length;
  }

  let isUrlNumber = false;
  if (Number(item.url) != NaN) isUrlNumber = false;
  else {
    isUrlNumber = true;
  }
  /* alert(props.item.user.profileSet[0].profilePic); */
  return (
    <>
      <Card
        navigation={props.navigation}
        linkcontent={linkcontent}
        item={item}
        linkindex={linkindex}
        lastindex={lastindex}
        text={text}
        logo={props.item.user.profileSet[0].profilePic}
        commentCount={commentCount}
        likecount={props.item.likes.length}
        title={props.item.user.username}
        date={dateWithTime}
        image={props.item.tweetfile}
        updateAfterCommentDelete={props.updateAfterCommentDelete}
        updateAfterDelete={props.updateAfterDelete}
        updateLikeFunction={props.updateLikeFunction}
        updateCommentFunction={props.updateCommentFunction}
        CREATE_LIKE_MUTATION={CREATE_LIKE_MUTATION}
      />
    </>
  );
}

const CREATE_LIKE_MUTATION = gql`
  mutation($tweetid: Int!) {
    createLike(tweetId: $tweetid) {
      tweet {
        id
      }
      likedordisliked
      likesid
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation($tweetid: Int!, $commenttext: String!) {
    createComment(tweetId: $tweetid, commenttext: $commenttext) {
      tweet {
        id
      }
      comment {
        comment
        commenttime
        id
      }
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation($tweetid: Int!) {
    deleteTweet(tweetid: $tweetid) {
      status
      tweetid
    }
  }
`;
const REPORT_ABUSE = gql`
  mutation($tweetid: Int!) {
    reportAbuse(tweetid: $tweetid) {
      status
      tweetid
    }
  }
`;
export default Singletweet;

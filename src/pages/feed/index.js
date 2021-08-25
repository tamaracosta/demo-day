/* eslint-disable no-param-reassign */
import {
  likePost, commentPost, showComments,
} from '../../lib/firebase-services.js';

export const updateLikes = async (postID, currentUserEmail, valueToBeChanged, amountOfLikes,
  likeStatus) => {
  likePost(postID, currentUserEmail);
  const resultado = await likePost(postID, currentUserEmail);
  if (resultado === 'like') {
    likeStatus.classList.remove('empty-like-btn');
    likeStatus.classList.add('full-like-btn');
    const newAmountOflikes = amountOfLikes + 1;
    valueToBeChanged.innerHTML = `${newAmountOflikes}`;
  } else {
    likeStatus.classList.remove('full-like-btn');
    likeStatus.classList.add('empty-like-btn');
    const newAmountOflikes = amountOfLikes - 1;
    valueToBeChanged.innerHTML = `${newAmountOflikes}`;
  }
};

export const getComments = async (postID, printComments) => {
  const currentComments = await showComments(postID);
  printComments(currentComments, postID);
};

export const getCurrentCommentsToPrint = async (postID, newCommentText, currentUserEmail,
  printComments) => {
  commentPost(postID, newCommentText, currentUserEmail);
  const currentComments = await commentPost(postID, newCommentText, currentUserEmail);
  printComments(currentComments, postID);
};


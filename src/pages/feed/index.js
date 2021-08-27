/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import {
  likePost, commentPost, showComments, deletePostComment, likePostComment,
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
  printComments, username) => {
  commentPost(postID, newCommentText, currentUserEmail, username);
  const currentComments = await commentPost(postID, newCommentText, currentUserEmail, username);
  printComments(currentComments, postID);
};

export const getCurrentCommentsToDelete = async (postIDForComments, commentID, printComments) => {
  deletePostComment(postIDForComments, commentID);
  const currentComments = await deletePostComment(postIDForComments, commentID);
  printComments(currentComments, postIDForComments);
};

export const getCurrentCommentLikes = async (postIDForComments, currentUserEmail, commentID,
  valueToBeChanged, amountOfLikes, likeStatus) => {
  likePostComment(postIDForComments, commentID, currentUserEmail);
  const likeOrDeslike = await likePostComment(postIDForComments, commentID, currentUserEmail);
  if (likeOrDeslike === 'like') {
    likeStatus.classList.remove('empty-like-comment-btn');
    likeStatus.classList.add('full-like-comment-btn');
    const newAmountOflikes = amountOfLikes + 1;
    valueToBeChanged.innerHTML = `${newAmountOflikes}`;
  } else {
    likeStatus.classList.remove('full-like-comment-btn');
    likeStatus.classList.add('empty-like-comment-btn');
    const newAmountOflikes = amountOfLikes - 1;
    valueToBeChanged.innerHTML = `${newAmountOflikes}`;
  }
};

export const publicationAge = (timeInSeconds) => {
  if (timeInSeconds < 60) {
    return 'agora há pouco';
  } if (timeInSeconds < 3600) {
    const timeInMinutes = Math.round(timeInSeconds / 60);
    return `há  ${timeInMinutes} min.:`;
  } if (timeInSeconds < 86400) {
    const timeInHours = Math.round(timeInSeconds / 3600);
    return `há  ${timeInHours} h.:`;
  } if (timeInSeconds < 604800) {
    const timeInDays = Math.round(timeInSeconds / 86400);
    return `há  ${timeInDays} dias.:`;
  } if (timeInSeconds < 2628288) {
    const timeInWeeks = Math.round(timeInSeconds / 604800);
    return `há  ${timeInWeeks} sem.:`;
  } if (timeInSeconds < 31536000) {
    const timeInMonths = Math.round(timeInSeconds / 2628288);
    return `há  ${timeInMonths} m.:`;
  } if (timeInSeconds === 31536000) {
    const timeInYears = Math.round(timeInSeconds / 31536000);
    return `há  ${timeInYears} a.:`;
  }
};

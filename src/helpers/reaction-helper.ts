import { Reaction } from '../common/types';

export const reactionHelper = (
  userId: string,
  likeArray: string[],
  dislikeArray: string[],
  reaction: Reaction,
): void => {
  const likeIndex = likeArray.indexOf(userId);
  const dislikeIndex = dislikeArray.indexOf(userId);

  if (reaction.value === true) {
    if (likeIndex === -1) {
      likeArray.push(userId);
    } else {
      likeArray.splice(likeIndex, 1);
    }
    if (dislikeIndex !== -1) {
      dislikeArray.splice(dislikeIndex, 1);
    }
  } else if (reaction.value === false) {
    if (dislikeIndex === -1) {
      dislikeArray.push(userId);
    } else {
      dislikeArray.splice(dislikeIndex, 1);
    }
    if (likeIndex !== -1) {
      likeArray.splice(likeIndex, 1);
    }
  }
};

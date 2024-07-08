let currentReviewId = null;

// Method to submit a review.
async function submitReview(e)
{
  e.preventDefault();
  const foodId = document.getElementById("foodId").dataset.id;
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const isUpvote = document.getElementById("like-review").checked;

  const response = await fetch(`/submitReview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      reviewSubject: title,
      reviewBody: body,
      foodId,
      isUpvote
    })
  });

  if (response.status === 200)
  {
    location.reload();
  }
  else 
  {
    alert("Failed to add review.")
  }
}

// Method to edit a review.
async function submitEditReview(e)
{
  e.preventDefault();
  const foodId = $("#foodId").data("id");
  const title = $("#edit-title").val();
  const body = $("#edit-body").val();
  let isUpvote = $("#edit-like-review").prop("checked");

  const response = await fetch(`/foods/${foodId}/reviews`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      reviewId: currentReviewId,
      reviewSubject: title,
      reviewBody: body,
      isUpvote
    })
  });

  if (response.status === 200)
  {
    location.reload();
  }
  else {
    alert("Failed to update review.");
  }
}

// Method to delete a review.
async function deleteReview(reviewId) 
{
  var result = window.confirm("Are you sure you want to delete this review?");
  
  if (!result) return;

  const foodId = document.getElementById("foodId").dataset.id;
  const response = await fetch(`/foods/${foodId}/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (response.status === 202) 
  {
    location.reload();
  }
}

// Method to open the edit review modal and populate the fields.
async function openEditReview(reviewId)
{
  // Retrieve the review data from the review item.
  var reviewItem = $(`#review_${reviewId}`);
  var title = reviewItem.find(".review_subject").text()
  var body = reviewItem.find(".review_body").text();
  var isUpvote = reviewItem.find(".is_upvote").attr("data-upvote");
  currentReviewId = reviewId;

  // Populate the edit modal fields
  $("#edit-title").val(title);
  $("#edit-body").val(body);
  $("#edit-like-review").prop("checked", isUpvote === "true");
  $("#edit-dislike-review").prop("checked", isUpvote !== "true");

  $("#editReviewModal").modal("show");
}

// Close modal and reset form.
$("#closeModalBtn").on("click", () => {
  $("#editReviewModal").modal("hide");
});

// ============== UPVOTE/DOWNVOTE FUNCTIONALITY ============== 7/8/2024: RENZO IMPLEMENTATION BELOW

async function vote(reviewId, voteType) { // Master function for voting.
  const foodId = document.getElementById("foodId").dataset.id; // Gets the current ID of the to-be-reviewed food.
  try {
      const response = await fetch(`/foods/${foodId}/reviews/${reviewId}/vote`, { 
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
          const data = await response.json();
          updateVoteUI(reviewId, data.upvotes, data.downvotes, data.userVoteStatus);
          showVotePrompt(data.userVoteStatus, data.previousVoteStatus);
      } else {
          throw new Error('Vote failed');
      }
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to vote. Please try again.');
  }
}

function updateVoteUI(reviewId, upvotes, downvotes, userVoteStatus) { // Function for the front-end update when vote actions occur.
  const voteContainer = document.getElementById(`vote_container_${reviewId}`); // Gets the specific voteContainer (AKA vote action input fields)
  if (!voteContainer) {
      console.error(`Vote container for review ${reviewId} not found`);
      return;
  }
  const upvoteContainer = document.getElementById(`upvote_container_${reviewId}`); 
  const downvoteContainer = document.getElementById(`downvote_container_${reviewId}`);
  const voteCount = voteContainer.querySelector('.vote-count'); 

  voteContainer.classList.remove('upvoted', 'downvoted'); // Reset all statuses
  upvoteContainer.classList.remove('upvoted-upvote-container', 'downvoted-downvote-container'); // Reset all statuses
  downvoteContainer.classList.remove('upvoted-upvote-container', 'downvoted-downvote-container'); // Reset all statuses

  if (userVoteStatus === 'upvote') { // Assigns upvote status to relevant containers if the user upvotes.
      voteContainer.classList.add('upvoted');
      upvoteContainer.classList.add('upvoted-upvote-container');
      downvoteContainer.classList.add('upvoted-upvote-container');
  } else if (userVoteStatus === 'downvote') {  // Assigns downvote status to relevant containers if the user upvotes.
      voteContainer.classList.add('downvoted');
      upvoteContainer.classList.add('downvoted-downvote-container');
      downvoteContainer.classList.add('downvoted-downvote-container');
  }

  voteCount.textContent = upvotes - downvotes; // Net vote count
}

function showVotePrompt(currentVoteStatus, previousVoteStatus) { // Function for alert pop-up after a vote action.
  let message = '';
  if (currentVoteStatus === null) { // NOTE: VOTE REMOVAL ISN'T BEING DETECTED. MAY FIX IN THE FUTURE, BUT IT IS A NON-ISSUE AS OF NOW.
      message = `You have removed your ${previousVoteStatus} from this review.`;
  } else if (currentVoteStatus === 'upvote') {
      message = previousVoteStatus === 'downvote' ? 'You changed your vote to an upvote.' : 'You have upvoted this review.';
  } else if (currentVoteStatus === 'downvote') {
      message = previousVoteStatus === 'upvote' ? 'You changed your vote to a downvote.' : 'You have downvoted this review.';
  }
  
  alert(message);
}

function upvoteReview(reviewId) { // Helper function for vote(), upvote action.
  vote(reviewId, 'upvote');
}

function downvoteReview(reviewId) { // Helper function for vote(), downvote action.
  vote(reviewId, 'downvote');
}
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

// ============== UPVOTE/DOWNVOTE FUNCTIONALITY ==============

// Method for upvoting a given review.
function upvoteReview(reviewId) 
{
  // Enable class name for containers
  $(`#vote_container_${reviewId}`).removeClass("downvoted");
  $(`#upvote_container_${reviewId}`).removeClass("downvoted-downvote-container");
  $(`#downvote_container_${reviewId}`).removeClass("downvoted-downvote-container");

  $(`#vote_container_${reviewId}`).addClass("upvoted");
  $(`#upvote_container_${reviewId}`).addClass("upvoted-upvote-container");
  $(`#downvote_container_${reviewId}`).addClass("upvoted-upvote-container");

  // TODO: PATCH REQUESTS HERE
}

// Method for downvoting a given review.
function downvoteReview(reviewId)
{
  $(`#vote_container_${reviewId}`).removeClass("upvoted");
  $(`#upvote_container_${reviewId}`).removeClass("upvoted-upvote-container");
  $(`#downvote_container_${reviewId}`).removeClass("upvoted-upvote-container");

  $(`#vote_container_${reviewId}`).addClass("downvoted");
  $(`#upvote_container_${reviewId}`).addClass("downvoted-downvote-container");
  $(`#downvote_container_${reviewId}`).addClass("downvoted-downvote-container");

  // TODO: PATCH REQUESTS HERE
}
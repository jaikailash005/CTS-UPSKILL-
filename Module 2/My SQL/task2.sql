USE eventdb;
SELECT
event_id,
AVG(rating) AS average_rating,
COUNT(feedback_id) AS total_feedbacks
FROM Feedback
GROUP BY event_id
HAVING COUNT(feedback_id) >= 2
ORDER BY average_rating DESC;
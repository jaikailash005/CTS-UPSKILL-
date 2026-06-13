USE eventdb;
SELECT
city,
COUNT(event_id)
AS total_events,
SUM(
CASE
WHEN status = 'completed'
THEN 1
ELSE 0
END
)
AS completed_events,
(
SUM(
CASE
WHEN status = 'completed'
THEN 1
ELSE 0
END
)
/
COUNT(event_id)
) * 100
AS completion_rate
FROM Events
GROUP BY city;
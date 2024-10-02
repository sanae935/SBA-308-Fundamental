const CourseInfo = {
    id: 308,
    name: "JavaScript"
  };
  
  const AssignmentGroup = {
    id: 1234,
    name: "Introduction to Java",
    course_id: 308,
    group_weight: 23,
    assignments: [
        { id: 1, name: "Basic JavaScript ", due_at: "2024-09-22", points_possible: 25 },
        { id: 2, name: "Functions", due_at: "2024-09-30", points_possible: 50 },
        { id: 3, name: "Data collections", due_at: "2024-10-01", points_possible: 150 }
    ]
  };  
  const learnerSubmissions = [
    { learner_id: 12, assignment_id: 1, submission: { submitted_at: "2024-09-12", score: 20 } }, 
    { learner_id: 12, assignment_id: 2, submission: { submitted_at: "2024-09-05", score: 50 } },
    { learner_id: 12, assignment_id: 3, submission: { submitted_at: "2024-09-08", score: 120 } }, 
    { learner_id: 13, assignment_id: 1, submission: { submitted_at: "2024-09-12", score: 25 } },
    { learner_id: 13, assignment_id: 2, submission: { submitted_at: "2024-09-05", score: 50 } },
    { learner_id: 13, assignment_id: 3, submission: { submitted_at: "2024-09-08", score: 150 } } 
];
  
  function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    if (assignmentGroup.course_id !== courseInfo.id) {
        throw new Error('Assignment group does not belong to the specified course.');
    }
  
    const learnerResults = {}; 
    learnerSubmissions.forEach(submission => {
        const assignment = assignmentGroup.assignments.find(a => a.id === submission.assignment_id);
  
        if (!assignment) {
            throw new Error(`Assignment with ID ${submission.assignment_id} not found in the group.`);
        }
  
        const dueDate = new Date(assignment.due_at);
        const currentDate = new Date();
        if (dueDate > currentDate) {
            return; 
        }
  
        let score = submission.submission.score;
        const submittedAt = new Date(submission.submission.submitted_at);
        if (submittedAt > dueDate) {
            score -= assignment.points_possible * 0.1; 
        }
  
        if (assignment.points_possible <= 0) {
            throw new Error(`Invalid points_possible for assignment ${assignment.id}`);
        }
  // calculate percentage score
        const percentageScore = (score / assignment.points_possible) * 100;
  
        if (!learnerResults[submission.learner_id]) {
            learnerResults[submission.learner_id] = {
                id: submission.learner_id,
                avg: 0,
                totalPoints: 0,
                totalWeightedScore: 0
            };
        }
  // individual assignment score
        learnerResults[submission.learner_id][assignment.id] = percentageScore;
  //  total weighted score and points
        learnerResults[submission.learner_id].totalWeightedScore += score;
        learnerResults[submission.learner_id].totalPoints += assignment.points_possible;
    });

  // Calculate final weighted average for each learner
    const result = [];
    for (const learnerId in learnerResults) {
        const learnerData = learnerResults[learnerId];
        learnerData.avg = (learnerData.totalWeightedScore / learnerData.totalPoints) * 100;
        delete learnerData.totalPoints;
        delete learnerData.totalWeightedScore;
        result.push(learnerData);
    }
  
    return result;
  }

  // Run the function and log results
  const learnerData = getLearnerData(CourseInfo, AssignmentGroup, learnerSubmissions);
  console.log(learnerData);
  
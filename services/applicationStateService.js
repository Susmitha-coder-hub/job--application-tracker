// services/applicationStateService.js

const VALID_TRANSITIONS = {
  Applied: ["Screening", "Rejected"],
  Screening: ["Interview", "Rejected"],
  Interview: ["Offer", "Rejected"],
  Offer: ["Hired", "Rejected"],
  Hired: [],
  Rejected: [],
};

const canTransition = (currentStage, nextStage) => {
  return VALID_TRANSITIONS[currentStage]?.includes(nextStage);
};

module.exports = { canTransition };

export const confirmDeleteAlert = (data) => {
  const answer = window.confirm(`Are you sure you want to delete this ${data}?`);
  return answer;
}
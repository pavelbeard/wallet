export default function getCurrentEpochTime() {
  return Math.floor(new Date().getTime() / 1000);
}

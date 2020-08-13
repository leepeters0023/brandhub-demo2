//mock fetch
import orders from "../assets/mockdata/Orders";

const timeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const fetchOrdersByProgram = async(user, program) => {
  await timeout(1000);
  //fetch to api with user and program for orders relating to that program
  if (program === "9") {
    return orders;
  } else return [];
}
// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};

export const APIBody =() => {
  const randomPhrases = [
    "Suggest me a random book that you haven't mentioned before.",
    "Can you recommend a unique book for me?",
    "I'm looking for a random book suggestion.",
    "Tell me about a book I might enjoy."
  ];
  
  const randomMessage = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
  return{
  "model": "gpt-3.5-turbo",
  "messages": [
      {
          "role": "system",
          "content": "You are a helpful assistant that suggests books."
      },
      {
          "role": "user",
          "content": randomMessage
      }
  ],
  "temperature": 1.0,
  "max_tokens": 60,
  "top_p": 0.9,
  "frequency_penalty": 0.0,
  "presence_penalty": 0.0
}
} 
function extractTitle(message) {
  // Match text between double quotes
  const regex = /"([^"]+)"/;
  const match = message.match(regex);
  
  if (match && match[1]) {
    return match[1]; // This is the extracted title
  } else {
    return null; // or some default value or error handling
  }
}


 export async function callOpenAIAPI() {
  const body = APIBody();
  await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + API_KEY
    },
    body:JSON.stringify(body)
  }).then((data)=>{
    return data.json();
  }).then((data) => {
    const recommendedTitle = extractTitle(data.choices[0].message.content);
    console.log(recommendedTitle);
    return recommendedTitle;
  })
 }
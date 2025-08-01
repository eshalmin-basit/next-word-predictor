# Next Word Predictor

A full-stack Next.js web application that predicts the next word in a sentence using a custom-trained n-gram language model implemented in JavaScript.

## Features

- **Custom ML Model**: Uses a trigram (3-gram) language model trained from scratch in JavaScript
- **Modern Frontend**: Built with Next.js 14, Tailwind CSS, and shadcn/ui components
- **Next.js API Routes**: Server-side prediction logic using Next.js API routes
- **Real-time Predictions**: Interactive interface with instant results
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Model Statistics**: View training data and model performance metrics

## Architecture

\`\`\`
Frontend (Next.js) → API Route (/api/predict) → N-gram Model → Prediction
\`\`\`

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm

### Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will be available at `http://localhost:3000`

The n-gram model is automatically trained when the API route is first accessed using the built-in training corpus.

## Usage

1. Open the web application in your browser
2. Enter a sentence in the input field (e.g., "The weather is very")
3. Click "Predict Next Word" or press Enter
4. View the predicted next word and confidence score
5. Check the model statistics to see training data metrics

## How It Works

### N-gram Language Model

The application uses a **trigram (3-gram) language model** implemented in TypeScript that:

1. **Training Phase:**
   - Analyzes patterns in the built-in training corpus
   - Creates trigrams (sequences of 3 words)
   - Maps word pairs to their most likely next word
   - Example: ("the", "weather") → "is"

2. **Prediction Phase:**
   - Takes the last two words of the input sentence
   - Looks up the most probable next word in the trained model
   - Returns the prediction with confidence score
   - Falls back to common words if no pattern is found

### API Endpoints

- `GET /api/predict` - API status and model statistics
- `POST /api/predict` - Predict next word for a given sentence

### Example API Usage

\`\`\`bash
curl -X POST "http://localhost:3000/api/predict" \
     -H "Content-Type: application/json" \
     -d '{"sentence": "the weather is very"}'
\`\`\`

Response:
\`\`\`json
{
  "word": "nice",
  "confidence": 0.8,
  "input": "the weather is very"
}
\`\`\`

## Customization

### Training with Your Own Data

1. Edit the `TRAINING_CORPUS` constant in `app/api/predict/route.ts`
2. Add your own text data
3. Restart the development server

### Model Parameters

The model uses trigrams by default. You can modify the n-gram size by adjusting the training logic in the `trainModel()` method.

## Technical Details

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **ML Model**: Custom n-gram implementation in TypeScript
- **Training Data**: Built-in corpus with diverse English text
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance**: Client-side caching and optimized predictions

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development!

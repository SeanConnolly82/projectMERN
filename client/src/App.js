import Uploader from './components/utils/Uploader';
import './App.css';
import Image from './components/content/Image';

function App() {
  return (
    <div className="App">
      <h1>Welcome to the Bookstore!</h1>
      <Uploader />
      <Image />
    </div>
  );
}

export default App;

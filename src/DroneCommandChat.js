import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Card, Container, FormControl } from "react-bootstrap";
import { Mic, MicOff, Send, Trash2 } from "react-feather";

export default function DroneCommandChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([]);
  const [satelliteCount, setSatelliteCount] = useState(null);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let speechToText = "";
        for (let i = 0; i < event.results.length; i++) {
          speechToText += event.results[i][0].transcript + " ";
        }
        setTranscript(speechToText.trim());
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
    }
    // Cleanup function
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (recognition) {
      if (!isRecording) {
        recognition.start();
        setIsRecording(true);
      } else {
        recognition.stop();
        setIsRecording(false);
      }
    }
  };

  const handleSend = () => {
    if (transcript.trim()) {
      const newMessages = [...messages, { sender: "User", text: transcript }];
      setMessages(newMessages);
      setTranscript("");
      
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "AI", text: "Generated JSON response..." }]);
      }, 1000);
    }
  };

  const handleClear = () => {
    setTranscript("");
  };

  const handleConnect = () => {
    console.log("Connecting to drone...");
    fetch('http://127.0.0.1:5000/drone_connect', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  };

  const handleSatelliteCount = () => {
    fetch('http://127.0.0.1:5000/satellites', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        setSatelliteCount(data.num_sats);
    })
    .catch(error => {
        console.error('Error:', error);
    });
  };

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <Card className="p-4 shadow-lg rounded border-0" style={{ maxWidth: "600px", width: "100%", background: "#ffffff" }}>
        <h3 className="text-center text-dark fw-bold">Drone Command Interface</h3>
        <br/>
        <div className="d-flex justify-content-between mb-3">
          <Button variant="primary" onClick={handleConnect} className="fw-bold">Connect</Button>
          <Button variant="info" onClick={handleSatelliteCount} className="fw-bold">Satellite Count</Button>
        </div>
        {satelliteCount !== null && (
          <p className="text-center text-dark">Satellite Count: <strong>{satelliteCount}</strong></p>
        )}
        <div className="chat-box mb-3 p-3 border rounded overflow-auto" style={{ maxHeight: "350px", background: "#f1f3f5" }}>
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 rounded mb-2 ${msg.sender === "User" ? "bg-primary text-white text-end shadow-sm" : "bg-light text-start shadow-sm"}`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <FormControl
          as="textarea"
          rows={3}
          className="mb-3 p-3 border border-secondary rounded shadow-sm"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Speak or type your command..."
          style={{ resize: "none" }}
        />
        <div className="d-flex justify-content-between">
          <Button variant={isRecording ? "secondary" : "danger"} onClick={toggleRecording} className="px-4 py-2 fw-bold d-flex align-items-center">
            {isRecording ? <MicOff className="me-2" /> : <Mic className="me-2" />} {isRecording ? "Stop" : "Start"}
          </Button>
          <Button variant="warning" onClick={handleClear} className="px-4 py-2 fw-bold d-flex align-items-center">
            <Trash2 className="me-2" /> Clear
          </Button>
          <Button variant="success" onClick={handleSend} className="px-4 py-2 fw-bold d-flex align-items-center" disabled={isRecording}>
            <Send className="me-2" /> Send
          </Button>
        </div>
      </Card>
    </Container>
  );
}
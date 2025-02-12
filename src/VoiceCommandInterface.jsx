import { useState } from "react";
import { Button, Card, Input } from "react-bootstrap";
import { Mic, MicOff, Send } from "react-feather";

export default function DroneCommandChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([]);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Placeholder for voice recording logic
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setTranscript("Example recorded command..."); // Replace with actual transcript
  };

  const handleSend = () => {
    if (transcript.trim()) {
      const newMessages = [...messages, { sender: "User", text: transcript }];
      setMessages(newMessages);
      setTranscript("");
      
      // Placeholder for sending to LLM
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "AI", text: "Generated JSON response..." }]);
      }, 1000);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <Card className="p-3 shadow-sm">
        <h5 className="text-center">Drone Command Interface</h5>
        <div className="chat-box mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 ${msg.sender === "User" ? "text-end" : "text-start"}`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="mb-2">
          <Input 
            as="textarea" 
            rows={2} 
            value={transcript} 
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your command..."
          />
        </div>
        <div className="d-flex justify-content-between">
          <Button variant="danger" onClick={handleStartRecording} disabled={isRecording}>
            <Mic /> Start
          </Button>
          <Button variant="secondary" onClick={handleStopRecording} disabled={!isRecording}>
            <MicOff /> Stop
          </Button>
          <Button variant="primary" onClick={handleSend}>
            <Send /> Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
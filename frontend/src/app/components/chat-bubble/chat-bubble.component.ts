import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAssistantService } from '../../services/ai-assistant.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SafePipe } from '../../pipes/safe.pipe';

interface ChatMessage {
  isUser: boolean;
  text: string;
  timestamp: Date;
  hasMap?: boolean;
  location?: string;
}

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe],
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.css']
})
export class ChatBubbleComponent implements AfterViewChecked {
  @ViewChild('chatMessages') chatMessagesRef!: ElementRef;
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  isOpen = false;
  userInput = '';
  messages: ChatMessage[] = [];
  isLoading = false;
  isListening = false;
  recognition: any;
  hasVoiceSupport = false;

  constructor(
    private aiService: AiAssistantService,
    private sanitizer: DomSanitizer
  ) {
    // Add initial welcome message
    this.messages.push({
      isUser: false,
      text: "Hello! I'm your university assistant. How can I help you find information about universities today?",
      timestamp: new Date()
    });
    
    // Initialize speech recognition if supported
    this.initSpeechRecognition();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatMessagesRef.nativeElement.scrollTop = this.chatMessagesRef.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }
  
  initSpeechRecognition(): void {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || 
                             (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.hasVoiceSupport = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.userInput = transcript;
        this.sendMessage();
      };
      
      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        this.isListening = false;
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
      };
    } else {
      console.log('Speech recognition not supported in this browser');
    }
  }
  
  toggleVoiceInput(): void {
    if (!this.hasVoiceSupport) return;
    
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      this.recognition.start();
      this.isListening = true;
    }
  }

  /**
   * @deprecated This method is no longer used directly in the template.
   * Message formatting is now handled by preprocessMessageText() when messages are added,
   * and the SafePipe is used in the template for HTML sanitization.
   */
  formatMessageText(text: string): SafeHtml {
    if (!text) return '';
    
    // This method is kept for backward compatibility
    const formattedText = this.preprocessMessageText(text);
    
    // Use the sanitizer directly
    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }

  // Use a suggested quick question
  useQuickQuestion(question: string): void {
    this.userInput = question;
    this.sendMessage();
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    // Add user message to chat
    this.messages.push({
      isUser: true,
      text: this.userInput,
      timestamp: new Date()
    });

    const userQuery = this.userInput;
    this.userInput = ''; // Clear input field
    this.isLoading = true;

    // Get response from AI service
    this.aiService.getAssistantResponse(userQuery).subscribe({
      next: (response) => {
        // Check if the response contains location data that should be displayed on a map
        const locationMatch = response.match(/location:?\s*([^.!?\n]+)/i);
        const hasMapRequest = userQuery.toLowerCase().includes('map') || 
                              userQuery.toLowerCase().includes('where is') ||
                              userQuery.toLowerCase().includes('location');
        
        // Preprocess the text before adding to messages
        const formattedText = this.preprocessMessageText(response);
        
        // Add AI response with map if location is found
        this.messages.push({
          isUser: false,
          text: formattedText,
          timestamp: new Date(),
          hasMap: hasMapRequest && locationMatch !== null,
          location: locationMatch ? locationMatch[1].trim() : undefined
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error getting AI response:', error);
        // Add error message
        this.messages.push({
          isUser: false,
          text: "Sorry, I couldn't process your request. Please try again.",
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }
  
  // Preprocess message text with formatting but without sanitization
  preprocessMessageText(text: string): string {
    if (!text) return '';
    
    // Replace markdown-like bold formatting
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace new lines with <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    // Replace emoji unicode with more visible emojis
    formattedText = formattedText.replace(/🏫/g, '<span class="emoji">🏫</span>');
    formattedText = formattedText.replace(/📍/g, '<span class="emoji">📍</span>');
    formattedText = formattedText.replace(/📝/g, '<span class="emoji">📝</span>');
    formattedText = formattedText.replace(/🖼️/g, '<span class="emoji">🖼️</span>');
    formattedText = formattedText.replace(/🏢/g, '<span class="emoji">🏢</span>');
    formattedText = formattedText.replace(/🗺️/g, '<span class="emoji">🗺️</span>');
    
    // Make bullet points more visible
    formattedText = formattedText.replace(/• (.*?)(?=<br>|$)/g, '<div class="bullet-point">• $1</div>');
    
    return formattedText;
  }
  
  showMap(location: string): void {
    // We'll implement the map display in the HTML using a simple iframe to Google Maps
    console.log('Showing map for location:', location);
  }
} 
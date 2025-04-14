import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap, catchError } from 'rxjs';
import { University } from '../models/university.model';
import { UniversityService } from './university.service';

@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private geminiApiKey = 'AIzaSyDx9vAdvFLJteMRuOYkn8T15JBYIIt9LlI';
  private geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(
    private http: HttpClient,
    private universityService: UniversityService
  ) { }

  getUniversityInfo(): Observable<University[]> {
    return this.universityService.getAllUniversities();
  }

  // Format university data into a readable profile
  formatUniversityProfile(university: University): string {
    let profile = `
🏫 **${university.nomUniv}**
${university.idUniv ? `ID: ${university.idUniv}` : ''}
${university.location ? `📍 Location: ${university.location}` : ''}
${university.description ? `📝 Description: ${university.description}` : ''}
${university.imagePath ? `🖼️ Has image: Yes` : ''}
${university.departements && university.departements.length > 0 ? 
  `🏢 Departments: ${university.departements.length} departments` : ''}
    `;
    return profile.trim();
  }

  // Check if the query is asking about a specific university
  showUniversityProfile(query: string, universities: University[]): string | null {
    query = query.toLowerCase();
    
    // Simple keyword matching for university queries
    const universityKeywords = [
      'profile', 'show', 'display', 'tell me about', 'information about', 
      'details of', 'details about', 'what is', 'who is', 'university'
    ];
    
    // Check if query contains university keywords
    const isAskingForUniversity = universityKeywords.some(keyword => query.includes(keyword.toLowerCase()));
    
    if (isAskingForUniversity) {
      // Try to find a matching university by name
      for (const university of universities) {
        if (university.nomUniv && query.includes(university.nomUniv.toLowerCase())) {
          return this.formatUniversityProfile(university);
        }
      }
      
      // If asking about universities in general, list all of them
      if (query.includes('all') || query.includes('list')) {
        let response = "Here are the universities in our system:\n\n";
        universities.forEach(uni => {
          response += `• ${uni.nomUniv}${uni.location ? ` (${uni.location})` : ''}\n`;
        });
        response += "\nFor more details about a specific university, just ask about it by name.";
        return response;
      }
    }
    
    return null;
  }

  askGemini(prompt: string, universityData?: any): Observable<any> {
    // Create context about universities if available
    let contextPrompt = prompt;
    if (universityData) {
      contextPrompt = `I have the following university data: ${JSON.stringify(universityData)}. 
      Based on this information, ${prompt}`;
    }

    const requestBody = {
      contents: [{
        parts: [{ text: contextPrompt }]
      }]
    };

    const url = `${this.geminiApiUrl}?key=${this.geminiApiKey}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(url, requestBody, { headers });
  }

  getAssistantResponse(userQuery: string): Observable<string> {
    // First get university data
    return this.getUniversityInfo().pipe(
      switchMap(universities => {
        // Check if this is a direct query about a university profile
        const universityProfile = this.showUniversityProfile(userQuery, universities);
        if (universityProfile) {
          return of(universityProfile);
        }
        
        // Otherwise, use Gemini API with university data as context
        return this.askGemini(userQuery, universities);
      }),
      switchMap(response => {
        // If it's already a string, it's a university profile we generated
        if (typeof response === 'string') {
          return of(response);
        }
        
        try {
          // Extract the text from the Gemini API response
          const responseText = response.candidates[0].content.parts[0].text;
          return of(responseText);
        } catch (error) {
          console.error('Error parsing Gemini response:', error);
          return of("Sorry, I couldn't process your request. Please try again.");
        }
      }),
      catchError(error => {
        console.error('Error calling Gemini API:', error);
        return of("Sorry, I'm having trouble connecting to my knowledge base. Please try again later.");
      })
    );
  }
} 
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatBubbleComponent } from './components/chat-bubble/chat-bubble.component';
import { UniversitySearchComponent } from './components/search/university-search.component';
import { SafePipe } from './pipes/safe.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, ChatBubbleComponent, UniversitySearchComponent, SafePipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Kaddem Management System';
}

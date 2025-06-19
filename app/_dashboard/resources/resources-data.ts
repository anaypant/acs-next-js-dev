export interface ResourceSection {
  id: string;
  title: string;
  description?: string;
  content: ResourceItem[];
  colorScheme: string;
  icon: string;
}

export interface ResourceItem {
  title: string;
  description: string;
  details?: string[];
  tips?: string[];
  clientWorkflow?: ClientWorkflowStep[];
  interactiveElements?: InteractiveElement[];
  featureHighlights?: FeatureHighlight[];
  stepByStepGuide?: StepByStepGuide[];
  commonScenarios?: CommonScenario[];
  troubleshootingSteps?: TroubleshootingStep[];
}

export interface ClientWorkflowStep {
  step: number;
  title: string;
  description: string;
  clientAction: string;
  systemResponse: string;
  expectedOutcome: string;
  timeEstimate: string;
}

export interface InteractiveElement {
  name: string;
  location: string;
  purpose: string;
  howToUse: string;
  bestPractices: string[];
}

export interface FeatureHighlight {
  feature: string;
  benefit: string;
  clientImpact: string;
  usageFrequency: string;
  customizationOptions: string[];
}

export interface StepByStepGuide {
  step: number;
  action: string;
  description: string;
  visualCue: string;
  expectedResult: string;
  tips: string[];
}

export interface CommonScenario {
  scenario: string;
  clientContext: string;
  recommendedAction: string;
  stepByStepProcess: string[];
  expectedOutcome: string;
  followUpActions: string[];
}

export interface TroubleshootingStep {
  issue: string;
  symptoms: string[];
  immediateActions: string[];
  preventiveMeasures: string[];
  whenToContactSupport: string;
}

export const resourcesData: ResourceSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Essential information to get you up and running with ACS",
    colorScheme: "from-blue-500 to-cyan-500",
    icon: "Home",
    content: [
      {
        title: "Quick Setup",
        description: "Get started with ACS in just a few steps",
        details: [
          "Log in to your ACS account",
          "Connect your email in the Settings page",
          "Explore the dashboard navigation on the left sidebar",
          "Review your lead conversion pipeline"
        ],
        stepByStepGuide: [
          {
            step: 1,
            action: "Account Access",
            description: "Navigate to the ACS login page and enter your credentials",
            visualCue: "Look for the green ACS logo and login form",
            expectedResult: "You'll be redirected to the main dashboard",
            tips: ["Bookmark the login page for quick access", "Enable 'Remember me' for convenience"]
          },
          {
            step: 2,
            action: "Email Integration",
            description: "Go to Settings → Email Configuration to connect your email",
            visualCue: "Settings icon in the bottom left sidebar",
            expectedResult: "Your emails will start appearing in the Email tab",
            tips: ["Use your primary business email", "Check spam folder if emails don't appear"]
          },
          {
            step: 3,
            action: "Dashboard Exploration",
            description: "Familiarize yourself with the main dashboard sections",
            visualCue: "Navigation menu on the left side",
            expectedResult: "You can navigate between all major features",
            tips: ["Start with the main dashboard overview", "Check the Conversations tab first"]
          }
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Initial Login",
            description: "First-time access to ACS platform",
            clientAction: "Enter email and password",
            systemResponse: "Dashboard loads with welcome message and setup prompts",
            expectedOutcome: "Access to main dashboard with guided tour",
            timeEstimate: "2-3 minutes"
          },
          {
            step: 2,
            title: "Email Setup",
            description: "Connecting business email account",
            clientAction: "Click 'Connect Email' in Settings",
            systemResponse: "OAuth authentication and email sync begins",
            expectedOutcome: "Emails appear in Email tab within 5-10 minutes",
            timeEstimate: "5-10 minutes"
          }
        ]
      },
      {
        title: "Navigation Guide",
        description: "Understanding the dashboard layout and navigation",
        details: [
          "Dashboard: Overview of your performance and metrics",
          "Conversations: Manage all client communications",
          "Leads: Track and manage potential clients",
          "Contacts: Store client information",
          "Calendar: Schedule appointments and viewings",
          "Email: Manage your email communications",
          "Analytics: Detailed performance insights",
          "Usage: Monitor your AI usage and billing",
          "Settings: Configure your account and preferences"
        ],
        interactiveElements: [
          {
            name: "Sidebar Navigation",
            location: "Left side of screen",
            purpose: "Primary navigation between major features",
            howToUse: "Click any menu item to navigate to that section",
            bestPractices: ["Use keyboard shortcuts (Ctrl+1, Ctrl+2, etc.)", "Collapse sidebar for more screen space"]
          },
          {
            name: "Search Bar",
            location: "Top of dashboard",
            purpose: "Quick search across all data",
            howToUse: "Type keywords to find conversations, leads, or contacts",
            bestPractices: ["Use specific terms for better results", "Search by client name or property address"]
          }
        ],
        featureHighlights: [
          {
            feature: "Real-time Updates",
            benefit: "Instant notification of new leads and messages",
            clientImpact: "Never miss important client communications",
            usageFrequency: "Daily",
            customizationOptions: ["Email notifications", "Push notifications", "Dashboard alerts"]
          }
        ]
      }
    ]
  },
  {
    id: "core-features",
    title: "Core Features",
    description: "Explore the main features and capabilities of ACS",
    colorScheme: "from-[#0a5a2f] to-[#157a42]",
    icon: "Zap",
    content: [
      {
        title: "Dashboard & Analytics",
        description: "Comprehensive overview of your real estate business",
        details: [
          "Main Dashboard: View lead conversion pipeline, performance metrics, and activity tracking",
          "Analytics: Analyze key metrics, conversion rates, lead sources, and trends over time",
          "Lead Funnel: Track leads through 5 stages (Contacted, Engaged, Toured, Offer Stage, Closed)",
          "Lead Reports: Generate and interpret reports on lead performance and growth"
        ],
        tips: [
          "Use date range selectors for custom analytics views",
          "Focus on conversion rates between funnel stages",
          "Monitor lead source effectiveness"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Daily Dashboard Review",
            description: "Start each day with a comprehensive dashboard overview",
            clientAction: "Open dashboard and review key metrics",
            systemResponse: "Display real-time data on leads, conversions, and performance",
            expectedOutcome: "Clear understanding of current business status",
            timeEstimate: "5-10 minutes"
          },
          {
            step: 2,
            title: "Lead Pipeline Analysis",
            description: "Review leads moving through conversion stages",
            clientAction: "Click on different funnel stages to see specific leads",
            systemResponse: "Show detailed list of leads in each stage",
            expectedOutcome: "Identify leads needing attention or follow-up",
            timeEstimate: "10-15 minutes"
          }
        ],
        interactiveElements: [
          {
            name: "Lead Funnel Visualization",
            location: "Main dashboard center",
            purpose: "Visual representation of lead conversion stages",
            howToUse: "Click on any funnel stage to see detailed lead list",
            bestPractices: ["Focus on stages with bottlenecks", "Use color coding to identify priority leads"]
          },
          {
            name: "Date Range Selector",
            location: "Top right of dashboard",
            purpose: "Filter data by specific time periods",
            howToUse: "Select predefined ranges or set custom dates",
            bestPractices: ["Compare current period to previous", "Use 30-day views for trend analysis"]
          }
        ],
        commonScenarios: [
          {
            scenario: "New Lead Arrives",
            clientContext: "Potential client submits inquiry through website",
            recommendedAction: "Review lead details and assign appropriate status",
            stepByStepProcess: [
              "Check lead source and initial message",
              "Review any attached property preferences",
              "Assign to appropriate funnel stage",
              "Send welcome message within 2 hours"
            ],
            expectedOutcome: "Lead properly categorized and initial response sent",
            followUpActions: ["Schedule follow-up call", "Add to nurturing sequence", "Update lead status"]
          }
        ]
      },
      {
        title: "Conversation Management",
        description: "AI-powered conversation tracking and lead scoring",
        details: [
          "Unified Inbox: Manage all client conversations in one place",
          "AI-Powered Lead Scoring: EV (Engagement Value) scores from 0-100",
          "Status Categories: Hot (80+), Warm (60-79), Cold (<60)",
          "Advanced Filtering: Search, filter by status, and use AI score ranges",
          "Message History: View full conversation threads and AI-generated insights"
        ],
        tips: [
          "Prioritize conversations with higher EV scores",
          "Use filters to focus on specific lead types",
          "Review AI insights for better understanding of client needs"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Conversation Review",
            description: "Daily review of all active conversations",
            clientAction: "Open Conversations tab and review unread messages",
            systemResponse: "Display conversations sorted by priority and engagement score",
            expectedOutcome: "Clear view of conversations requiring attention",
            timeEstimate: "15-20 minutes"
          },
          {
            step: 2,
            title: "Lead Scoring Analysis",
            description: "Review AI-generated engagement scores",
            clientAction: "Click on high-scoring leads to review details",
            systemResponse: "Show detailed conversation history and AI insights",
            expectedOutcome: "Understanding of why leads have specific scores",
            timeEstimate: "5-10 minutes per lead"
          }
        ],
        interactiveElements: [
          {
            name: "EV Score Filter",
            location: "Conversations page top",
            purpose: "Filter conversations by engagement value",
            howToUse: "Select score ranges (Hot: 80+, Warm: 60-79, Cold: <60)",
            bestPractices: ["Start with Hot leads each day", "Review Warm leads weekly", "Re-engage Cold leads monthly"]
          },
          {
            name: "Conversation Thread",
            location: "Right panel when conversation selected",
            purpose: "View full message history and AI insights",
            howToUse: "Click on any conversation to expand the thread view",
            bestPractices: ["Review AI insights before responding", "Use message templates for consistency"]
          }
        ],
        troubleshootingSteps: [
          {
            issue: "Low EV Scores",
            symptoms: ["Leads showing scores below 60", "Poor response rates", "Limited engagement"],
            immediateActions: [
              "Review conversation quality and response times",
              "Check if leads are receiving messages",
              "Analyze message content for engagement triggers"
            ],
            preventiveMeasures: [
              "Respond within 2 hours during business hours",
              "Personalize messages with specific details",
              "Ask engaging questions to encourage responses"
            ],
            whenToContactSupport: "If scores remain low despite following best practices"
          }
        ]
      },
      {
        title: "Lead Management",
        description: "Comprehensive lead tracking and management system",
        details: [
          "Leads Dashboard: Track and manage all potential clients",
          "AI Lead Scoring: Focus on the most promising leads",
          "Status Tracking: Monitor hot, warm, and cold leads",
          "Quick Actions: Email, call, or schedule with leads directly"
        ],
        tips: [
          "Regularly review and update lead statuses",
          "Use quick actions for faster response times",
          "Focus on high-scoring leads for better conversion"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Lead Prioritization",
            description: "Daily prioritization of leads by engagement score",
            clientAction: "Sort leads by EV score and review top prospects",
            systemResponse: "Display leads in priority order with key metrics",
            expectedOutcome: "Clear action plan for the day's lead activities",
            timeEstimate: "10-15 minutes"
          },
          {
            step: 2,
            title: "Lead Nurturing",
            description: "Systematic follow-up with leads in different stages",
            clientAction: "Use quick actions to send emails or schedule calls",
            systemResponse: "Track all interactions and update lead status",
            expectedOutcome: "Consistent engagement with all active leads",
            timeEstimate: "30-45 minutes"
          }
        ],
        interactiveElements: [
          {
            name: "Quick Actions Menu",
            location: "Each lead card",
            purpose: "Rapid access to common lead actions",
            howToUse: "Click the three-dot menu on any lead card",
            bestPractices: ["Use for immediate responses", "Schedule follow-ups in advance"]
          },
          {
            name: "Lead Status Updates",
            location: "Lead detail view",
            purpose: "Update lead progression through funnel",
            howToUse: "Click status dropdown and select new stage",
            bestPractices: ["Update status after each meaningful interaction", "Use consistent status definitions"]
          }
        ]
      },
      {
        title: "Email Management",
        description: "Streamlined email communication and organization",
        details: [
          "Email Inbox: Manage all inbound and outbound emails",
          "Email Templates: Use pre-built templates for common responses",
          "Email Categorization: Automatic sorting (lead, client, hot-lead, junk)",
          "Spam Management: Review and recover emails from Junk folder"
        ],
        tips: [
          "Customize email templates for your specific needs",
          "Regularly check the junk folder for important emails",
          "Use categorization to prioritize responses"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Email Review",
            description: "Morning email review and categorization",
            clientAction: "Open Email tab and review new messages",
            systemResponse: "Display emails sorted by category and priority",
            expectedOutcome: "Clear understanding of which emails need immediate attention",
            timeEstimate: "10-15 minutes"
          },
          {
            step: 2,
            title: "Template Response",
            description: "Use templates for consistent, professional responses",
            clientAction: "Select appropriate template and customize content",
            systemResponse: "Track email responses and update lead status",
            expectedOutcome: "Professional, consistent communication with all leads",
            timeEstimate: "5-10 minutes per email"
          }
        ],
        interactiveElements: [
          {
            name: "Email Categories",
            location: "Email tab sidebar",
            purpose: "Organize emails by type and priority",
            howToUse: "Click category tabs to filter emails",
            bestPractices: ["Start with Hot Lead category", "Check Junk folder daily", "Use categories for workflow organization"]
          },
          {
            name: "Template Library",
            location: "Email compose window",
            purpose: "Access pre-written response templates",
            howToUse: "Click template button when composing new email",
            bestPractices: ["Customize templates for personal touch", "Create templates for common scenarios", "Update templates regularly"]
          }
        ]
      },
      {
        title: "Contact Management",
        description: "Organized client information and relationship tracking",
        details: [
          "Contacts: Store and manage client information (buyers, sellers, investors)",
          "Status & Type: Track active/inactive status and contact type",
          "Search & Filter: Quickly find contacts using search and filters"
        ],
        tips: [
          "Keep contact information updated regularly",
          "Use tags and categories for better organization",
          "Maintain detailed notes for each contact"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Contact Creation",
            description: "Add new contacts from leads or manual entry",
            clientAction: "Click 'Add Contact' and fill in required information",
            systemResponse: "Create contact record and link to existing conversations",
            expectedOutcome: "Complete contact profile with all relevant information",
            timeEstimate: "2-3 minutes per contact"
          },
          {
            step: 2,
            title: "Contact Maintenance",
            description: "Regular updates to contact information and status",
            clientAction: "Review and update contact details monthly",
            systemResponse: "Maintain accurate contact database",
            expectedOutcome: "Up-to-date contact information for all clients",
            timeEstimate: "5-10 minutes per contact"
          }
        ],
        interactiveElements: [
          {
            name: "Contact Search",
            location: "Contacts page top",
            purpose: "Quickly find specific contacts",
            howToUse: "Type name, email, or phone number to search",
            bestPractices: ["Use partial names for broader searches", "Search by property address for past clients"]
          },
          {
            name: "Contact Filters",
            location: "Contacts page sidebar",
            purpose: "Filter contacts by type, status, or other criteria",
            howToUse: "Select filter options to narrow contact list",
            bestPractices: ["Use filters for targeted outreach campaigns", "Filter by activity status for follow-ups"]
          }
        ]
      },
      
    ]
  },
  {
    id: "ai-features",
    title: "AI Features & Insights",
    description: "Leverage artificial intelligence to improve your real estate business",
    colorScheme: "from-purple-500 to-pink-500",
    icon: "Sparkles",
    content: [
      {
        title: "AI-Powered Lead Scoring",
        description: "Intelligent lead evaluation and prioritization",
        details: [
          "EV scores (0-100) help prioritize leads effectively",
          "Hot leads (80+): High engagement and conversion potential",
          "Warm leads (60-79): Moderate interest requiring follow-up",
          "Cold leads (<60): Low engagement, may need different approach"
        ],
        tips: [
          "Focus your efforts on hot and warm leads",
          "Review cold leads periodically for potential reactivation",
          "Use score trends to identify improving or declining leads"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Score Review",
            description: "Daily review of lead engagement scores",
            clientAction: "Open Conversations tab and sort by EV score",
            systemResponse: "Display leads with current engagement scores",
            expectedOutcome: "Clear prioritization of daily activities",
            timeEstimate: "5-10 minutes"
          },
          {
            step: 2,
            title: "Score Analysis",
            description: "Understanding why leads have specific scores",
            clientAction: "Click on leads to review conversation history",
            systemResponse: "Show detailed conversation analysis and AI insights",
            expectedOutcome: "Understanding of lead engagement patterns",
            timeEstimate: "3-5 minutes per lead"
          }
        ],
        interactiveElements: [
          {
            name: "Score Visualization",
            location: "Lead cards and conversation list",
            purpose: "Visual representation of engagement scores",
            howToUse: "Look for colored score indicators on lead cards",
            bestPractices: ["Green (80+) = Hot leads", "Yellow (60-79) = Warm leads", "Red (<60) = Cold leads"]
          },
          {
            name: "Score Trends",
            location: "Lead detail view",
            purpose: "Track score changes over time",
            howToUse: "Review score history in lead profile",
            bestPractices: ["Monitor improving scores", "Identify declining engagement", "Use trends for follow-up timing"]
          }
        ]
      },
      {
        title: "AI Insights & Analysis",
        description: "Deep understanding of client needs and preferences",
        details: [
          "Client Need Summaries: Budget, property types, timeline analysis",
          "Conversation Analysis: Message content and engagement tracking",
          "Response Quality Feedback: AI suggestions for better communication",
          "Automated Suggestions: Follow-up reminders and next-step recommendations"
        ],
        tips: [
          "Review AI insights before client meetings",
          "Use suggestions to improve response quality",
          "Leverage insights for personalized communication"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Insight Review",
            description: "Review AI-generated insights before client interactions",
            clientAction: "Click on conversation to view AI insights panel",
            systemResponse: "Display client preferences, budget, and timeline analysis",
            expectedOutcome: "Better understanding of client needs for personalized communication",
            timeEstimate: "2-3 minutes per client"
          },
          {
            step: 2,
            title: "Response Optimization",
            description: "Use AI feedback to improve communication quality",
            clientAction: "Review AI suggestions before sending responses",
            systemResponse: "Provide real-time feedback on response quality",
            expectedOutcome: "Higher quality, more engaging client communications",
            timeEstimate: "1-2 minutes per response"
          }
        ],
        interactiveElements: [
          {
            name: "AI Insights Panel",
            location: "Right side of conversation view",
            purpose: "Display AI-generated client insights",
            howToUse: "Click on any conversation to view insights",
            bestPractices: ["Review before client calls", "Use insights for personalization", "Update insights as conversations progress"]
          },
          {
            name: "Response Suggestions",
            location: "Email compose window",
            purpose: "AI-powered response recommendations",
            howToUse: "Look for suggestion bubbles while composing",
            bestPractices: ["Consider AI suggestions", "Customize for personal touch", "Use for complex responses"]
          }
        ]
      }
    ]
  },
  {
    id: "security",
    title: "Security & Privacy",
    description: "Protecting your data and maintaining client confidentiality",
    colorScheme: "from-red-500 to-orange-500",
    icon: "Shield",
    content: [
      {
        title: "Account Security",
        description: "Safeguarding your ACS account and credentials",
        details: [
          "Password Management: Change passwords regularly in Settings",
          "Session Management: Secure login with automatic timeout",
          "Unauthorized Access: Automatic logout on suspicious activity",
          "Two-Factor Authentication: Enhanced security (if available)"
        ],
        tips: [
          "Use strong, unique passwords",
          "Log out when using shared computers",
          "Enable two-factor authentication if available"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Password Update",
            description: "Regular password updates for account security",
            clientAction: "Go to Settings → Security → Change Password",
            systemResponse: "Verify current password and set new secure password",
            expectedOutcome: "Updated password with enhanced security",
            timeEstimate: "2-3 minutes"
          },
          {
            step: 2,
            title: "Session Review",
            description: "Review active sessions and logout unused devices",
            clientAction: "Check Settings → Security → Active Sessions",
            systemResponse: "Display all active login sessions",
            expectedOutcome: "Control over account access from multiple devices",
            timeEstimate: "1-2 minutes"
          }
        ],
        interactiveElements: [
          {
            name: "Security Settings",
            location: "Settings → Security tab",
            purpose: "Manage account security preferences",
            howToUse: "Navigate to security settings to update preferences",
            bestPractices: ["Enable two-factor authentication", "Set strong passwords", "Review session activity regularly"]
          }
        ]
      },
      {
        title: "Data Protection",
        description: "Comprehensive data security and privacy measures",
        details: [
          "Encryption: All data encrypted in transit and at rest",
          "Client-Side Security: Sensitive information never exposed",
          "Access Controls: Strict permission-based data access",
          "Compliance: Meets real estate industry privacy standards"
        ],
        tips: [
          "Never share login credentials",
          "Report suspicious activity immediately",
          "Regularly review account access"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Privacy Review",
            description: "Regular review of data sharing and privacy settings",
            clientAction: "Check Settings → Privacy to review data sharing",
            systemResponse: "Display current privacy settings and data usage",
            expectedOutcome: "Understanding of how data is used and protected",
            timeEstimate: "3-5 minutes"
          }
        ]
      },
      {
        title: "Email Security",
        description: "Protecting your email communications",
        details: [
          "Spam Filtering: Advanced filtering to protect against threats",
          "Email Validation: Verification of email authenticity",
          "Secure Transmission: Encrypted email delivery",
          "Privacy Controls: You control data sharing and visibility"
        ],
        tips: [
          "Review spam folder regularly",
          "Be cautious with email attachments",
          "Verify sender authenticity before responding"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Spam Review",
            description: "Daily review of spam folder for legitimate emails",
            clientAction: "Check Junk folder in Email tab",
            systemResponse: "Display filtered emails with option to mark as not spam",
            expectedOutcome: "Recovery of any legitimate emails caught by filters",
            timeEstimate: "2-3 minutes"
          }
        ],
        interactiveElements: [
          {
            name: "Spam Management",
            location: "Email → Junk folder",
            purpose: "Review and recover filtered emails",
            howToUse: "Click 'Not Spam' on legitimate emails",
            bestPractices: ["Check daily", "Report false positives", "Train spam filter"]
          }
        ]
      }
    ]
  },
  {
    id: "usage-analytics",
    title: "Usage & Analytics",
    description: "Monitor your usage and optimize performance",
    colorScheme: "from-indigo-500 to-blue-500",
    icon: "TrendingUp",
    content: [
      {
        title: "Usage Dashboard",
        description: "Track your AI usage and system performance",
        details: [
          "API Calls: Monitor daily and monthly API usage",
          "Token Tracking: Track AI token consumption",
          "Conversation Counts: Monitor conversation volume",
          "Performance Metrics: Response times and system efficiency"
        ],
        tips: [
          "Monitor usage to stay within limits",
          "Optimize conversations for efficiency",
          "Review performance metrics regularly"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Usage Review",
            description: "Weekly review of system usage and performance",
            clientAction: "Open Usage tab and review current metrics",
            systemResponse: "Display usage statistics and performance data",
            expectedOutcome: "Understanding of system usage patterns and costs",
            timeEstimate: "5-10 minutes"
          }
        ],
        interactiveElements: [
          {
            name: "Usage Charts",
            location: "Usage dashboard",
            purpose: "Visual representation of usage trends",
            howToUse: "Review charts to understand usage patterns",
            bestPractices: ["Monitor daily trends", "Compare weekly usage", "Set usage alerts"]
          }
        ]
      },
      {
        title: "Billing & Optimization",
        description: "Understanding costs and optimizing usage",
        details: [
          "Usage-Based Billing: Pay only for what you use",
          "Cost Efficiency: Optimize usage for better value",
          "Billing Alerts: Get notified of usage thresholds",
          "Usage Reports: Detailed breakdown of costs"
        ],
        tips: [
          "Set up billing alerts to avoid surprises",
          "Review usage patterns for optimization",
          "Consider usage trends for planning"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Billing Review",
            description: "Monthly review of billing and usage costs",
            clientAction: "Check Usage → Billing section",
            systemResponse: "Display current billing status and usage breakdown",
            expectedOutcome: "Clear understanding of costs and optimization opportunities",
            timeEstimate: "5-10 minutes"
          }
        ]
      },
      {
        title: "Performance Analytics",
        description: "Track key performance indicators",
        details: [
          "Response Times: Monitor system and AI response speed",
          "Conversion Rates: Track lead to client conversion",
          "Lead Sources: Identify most effective lead channels",
          "Trend Analysis: Long-term performance tracking"
        ],
        tips: [
          "Focus on improving conversion rates",
          "Identify and optimize top lead sources",
          "Use trends to predict future performance"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Performance Review",
            description: "Weekly review of key performance metrics",
            clientAction: "Open Analytics tab and review conversion data",
            systemResponse: "Display performance metrics and trend analysis",
            expectedOutcome: "Understanding of business performance and optimization opportunities",
            timeEstimate: "10-15 minutes"
          }
        ],
        interactiveElements: [
          {
            name: "Performance Charts",
            location: "Analytics dashboard",
            purpose: "Visual performance tracking and trend analysis",
            howToUse: "Review charts to identify performance patterns",
            bestPractices: ["Focus on conversion trends", "Monitor lead source effectiveness", "Track response time improvements"]
          }
        ]
      }
    ]
  },
  {
    id: "best-practices",
    title: "Best Practices",
    description: "Proven strategies for success with ACS",
    colorScheme: "from-yellow-500 to-orange-500",
    icon: "Award",
    content: [
      {
        title: "Communication Excellence",
        description: "Optimize your client communication strategy",
        details: [
          "Quick Response: Timely responses improve conversion rates",
          "Personalization: Use client names and specific details",
          "Professional Tone: Maintain consistent, professional communication",
          "Follow-up Strategy: Systematic follow-up for better engagement"
        ],
        tips: [
          "Aim to respond within 2 hours during business hours",
          "Personalize messages with specific property details",
          "Use templates but customize for each client"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Response Management",
            description: "Daily management of client communications",
            clientAction: "Review and respond to all new messages within 2 hours",
            systemResponse: "Track response times and update conversation status",
            expectedOutcome: "Improved client satisfaction and conversion rates",
            timeEstimate: "30-45 minutes daily"
          }
        ],
        commonScenarios: [
          {
            scenario: "New Lead Inquiry",
            clientContext: "Potential client asks about property availability",
            recommendedAction: "Respond within 2 hours with personalized information",
            stepByStepProcess: [
              "Acknowledge the inquiry immediately",
              "Provide specific property details",
              "Ask qualifying questions",
              "Schedule follow-up call or viewing"
            ],
            expectedOutcome: "Engaged lead ready for next steps",
            followUpActions: ["Send property details", "Schedule viewing", "Add to nurturing sequence"]
          }
        ]
      },
      {
        title: "Dashboard Optimization",
        description: "Maximize your dashboard efficiency",
        details: [
          "Filter Usage: Leverage filters to focus on high-priority items",
          "Regular Reviews: Daily dashboard checks for new leads",
          "Status Updates: Keep lead and contact statuses current",
          "Analytics Review: Weekly performance analysis"
        ],
        tips: [
          "Set up daily dashboard review routines",
          "Use filters to create focused work sessions",
          "Schedule weekly analytics reviews"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Daily Dashboard Review",
            description: "Start each day with comprehensive dashboard overview",
            clientAction: "Open dashboard and review all key metrics and new items",
            systemResponse: "Display updated metrics and highlight new activities",
            expectedOutcome: "Clear action plan for the day's activities",
            timeEstimate: "10-15 minutes"
          }
        ]
      },
      {
        title: "Lead Management",
        description: "Effective lead nurturing and conversion",
        details: [
          "Lead Prioritization: Focus on high-scoring leads first",
          "Nurturing Process: Systematic follow-up and engagement",
          "Conversion Tracking: Monitor progress through funnel stages",
          "Relationship Building: Long-term client relationship development"
        ],
        tips: [
          "Create nurturing sequences for different lead types",
          "Track conversion rates at each funnel stage",
          "Focus on relationship building over quick sales"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Lead Prioritization",
            description: "Daily prioritization of leads by engagement and potential",
            clientAction: "Sort leads by EV score and review top prospects",
            systemResponse: "Display leads in priority order with key metrics",
            expectedOutcome: "Focused effort on highest-potential leads",
            timeEstimate: "10-15 minutes"
          }
        ]
      }
    ]
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting & Support",
    description: "Solutions for common issues and getting help",
    colorScheme: "from-gray-500 to-slate-500",
    icon: "HelpCircle",
    content: [
      {
        title: "Common Issues",
        description: "Solutions for frequently encountered problems",
        details: [
          "Email Integration: Ensure email is connected in Settings",
          "Lead Scoring: Review conversation history for scoring accuracy",
          "Dashboard Problems: Try refreshing or logging out/in",
          "Performance Issues: Check internet connection and browser"
        ],
        tips: [
          "Clear browser cache if experiencing issues",
          "Check email connection status regularly",
          "Contact support for persistent problems"
        ],
        troubleshootingSteps: [
          {
            issue: "Email Not Syncing",
            symptoms: ["New emails not appearing", "Sync errors in settings", "Missing conversations"],
            immediateActions: [
              "Check email connection in Settings",
              "Refresh the page",
              "Clear browser cache"
            ],
            preventiveMeasures: [
              "Regularly check connection status",
              "Use supported email providers",
              "Keep browser updated"
            ],
            whenToContactSupport: "If email still doesn't sync after basic troubleshooting"
          }
        ]
      },
      {
        title: "Getting Help",
        description: "How to get support when you need it",
        details: [
          "Support Contact: Email support@automatedconsultancy.com for assistance",
          "Documentation: Check this resources page for answers",
          "Community: Connect with other ACS users (if available)",
          "Feature Requests: Submit new feature ideas through support"
        ],
        tips: [
          "Include specific details when contacting support",
          "Check documentation before reaching out",
          "Provide screenshots for technical issues"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Issue Documentation",
            description: "Document the issue before contacting support",
            clientAction: "Take screenshots and note specific error messages",
            systemResponse: "Provide detailed information for support team",
            expectedOutcome: "Faster resolution with complete information",
            timeEstimate: "5-10 minutes"
          }
        ]
      }
    ]
  },
  {
    id: "advanced-features",
    title: "Advanced Features",
    description: "Power-user features and customization options",
    colorScheme: "from-violet-500 to-purple-500",
    icon: "Settings",
    content: [
      {
        title: "Customization",
        description: "Personalize your ACS experience",
        details: [
          "Dashboard Layout: Customize dashboard layout and widgets",
          "Notifications: Set up personalized alert preferences",
          "Templates: Create custom email and response templates",
          "Workflows: Set up automated processes and sequences"
        ],
        tips: [
          "Start with basic customization and expand gradually",
          "Test new workflows before full implementation",
          "Regularly review and update custom settings"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Template Creation",
            description: "Create custom email templates for common scenarios",
            clientAction: "Go to Settings → Templates and create new template",
            systemResponse: "Save template for future use in email composition",
            expectedOutcome: "Consistent, professional communication templates",
            timeEstimate: "10-15 minutes per template"
          }
        ]
      },
      {
        title: "Integrations",
        description: "Connect ACS with your existing tools",
        details: [
          "Calendar Sync: Connect with external calendar applications",
          "CRM Integration: Sync with popular CRM platforms",
          "Email Clients: Connect multiple email accounts",
          "Third-Party Tools: Integration with marketing and analytics tools"
        ],
        tips: [
          "Start with essential integrations first",
          "Test integrations thoroughly before relying on them",
          "Keep integration credentials secure"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Integration Setup",
            description: "Set up essential integrations for workflow efficiency",
            clientAction: "Go to Settings → Integrations and connect required tools",
            systemResponse: "Establish secure connection with external services",
            expectedOutcome: "Seamless workflow between ACS and other tools",
            timeEstimate: "15-30 minutes per integration"
          }
        ]
      },
      {
        title: "Automation",
        description: "Streamline your workflow with automation",
        details: [
          "Auto-Responses: Set up automatic email responses",
          "Lead Routing: Automatically assign leads to team members",
          "Follow-up Sequences: Automated follow-up campaigns",
          "Reporting: Scheduled report generation and delivery"
        ],
        tips: [
          "Start with simple automations and build complexity",
          "Monitor automation performance regularly",
          "Maintain personal touch alongside automation"
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Automation Setup",
            description: "Configure automated workflows for efficiency",
            clientAction: "Go to Settings → Automation and set up desired workflows",
            systemResponse: "Create automated processes for common tasks",
            expectedOutcome: "Reduced manual work and improved consistency",
            timeEstimate: "20-30 minutes per automation"
          }
        ]
      }
    ]
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    description: "Quick answers to common questions",
    colorScheme: "from-teal-500 to-cyan-500",
    icon: "MessageSquare",
    content: [
      {
        title: "Data Security",
        description: "Understanding how your data is protected",
        details: [
          "Q: How is my data secured?",
          "A: All data is encrypted and access is strictly controlled. See the Security section for details.",
          "",
          "Q: Can I export my data?",
          "A: Contact support for data export requests and options."
        ],
        commonScenarios: [
          {
            scenario: "Data Export Request",
            clientContext: "Need to export client data for backup or migration",
            recommendedAction: "Contact support with specific export requirements",
            stepByStepProcess: [
              "Email support@automatedconsultancy.com with export request",
              "Specify data types needed",
              "Provide account verification",
              "Wait for export file delivery"
            ],
            expectedOutcome: "Secure data export in requested format",
            followUpActions: ["Verify export completeness", "Secure storage of exported data"]
          }
        ]
      },
      {
        title: "Lead Scoring",
        description: "Understanding the AI lead scoring system",
        details: [
          "Q: How does lead scoring work?",
          "A: AI analyzes conversation content and engagement to assign a score from 0-100.",
          "",
          "Q: Why did a lead's score change?",
          "A: Scores update based on new interactions and engagement patterns."
        ],
        commonScenarios: [
          {
            scenario: "Score Drop",
            clientContext: "Lead score decreased unexpectedly",
            recommendedAction: "Review recent interactions and engagement",
            stepByStepProcess: [
              "Check conversation history",
              "Review response times",
              "Analyze message quality",
              "Identify engagement issues"
            ],
            expectedOutcome: "Understanding of score change and improvement plan",
            followUpActions: ["Improve response quality", "Increase engagement", "Monitor score trends"]
          }
        ]
      },
      {
        title: "Account Management",
        description: "Managing your ACS account and settings",
        details: [
          "Q: Can I recover deleted leads or emails?",
          "A: Deleted items are permanently removed for privacy and security.",
          "",
          "Q: How do I request a new feature?",
          "A: Contact support or use the feature request form in the dashboard."
        ],
        clientWorkflow: [
          {
            step: 1,
            title: "Feature Request",
            description: "Submit new feature ideas for consideration",
            clientAction: "Use feature request form or contact support",
            systemResponse: "Log request for development team review",
            expectedOutcome: "Feature request submitted for consideration",
            timeEstimate: "5-10 minutes"
          }
        ]
      }
    ]
  }
]; 
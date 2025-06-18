export interface ResourceSection {
  id: string;
  title: string;
  description?: string;
  content: ResourceItem[];
}

export interface ResourceItem {
  title: string;
  description: string;
  details?: string[];
  tips?: string[];
}

export const resourcesData: ResourceSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Essential information to get you up and running with ACS",
    content: [
      {
        title: "Quick Setup",
        description: "Get started with ACS in just a few steps",
        details: [
          "Log in to your ACS account",
          "Connect your email in the Settings page",
          "Explore the dashboard navigation on the left sidebar",
          "Review your lead conversion pipeline"
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
        ]
      }
    ]
  },
  {
    id: "core-features",
    title: "Core Features",
    description: "Explore the main features and capabilities of ACS",
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
        ]
      },
      {
        title: "Calendar & Scheduling",
        description: "Efficient appointment and event management",
        details: [
          "Calendar: Manage appointments, property viewings, and follow-ups",
          "Event Types: Viewings, consultations, offers, follow-ups, contract signings",
          "Status: Track confirmed and pending events"
        ],
        tips: [
          "Set up recurring appointments for regular follow-ups",
          "Use calendar reminders for important events",
          "Sync with external calendar applications"
        ]
      }
    ]
  },
  {
    id: "ai-features",
    title: "AI Features & Insights",
    description: "Leverage artificial intelligence to improve your real estate business",
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
        ]
      }
    ]
  },
  {
    id: "security",
    title: "Security & Privacy",
    description: "Protecting your data and maintaining client confidentiality",
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
        ]
      }
    ]
  },
  {
    id: "usage-analytics",
    title: "Usage & Analytics",
    description: "Monitor your usage and optimize performance",
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
        ]
      }
    ]
  },
  {
    id: "best-practices",
    title: "Best Practices",
    description: "Proven strategies for success with ACS",
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
        ]
      }
    ]
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting & Support",
    description: "Solutions for common issues and getting help",
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
        ]
      }
    ]
  },
  {
    id: "advanced-features",
    title: "Advanced Features",
    description: "Power-user features and customization options",
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
        ]
      }
    ]
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    description: "Quick answers to common questions",
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
        ]
      }
    ]
  }
]; 
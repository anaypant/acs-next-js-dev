import { DetailedFeatureData } from './types';

export const coreFeaturesData: Record<string, DetailedFeatureData> = {
  'Dashboard & Analytics': {
    overview: {
      summary: "The Dashboard & Analytics feature provides comprehensive insights into your real estate business performance, lead conversion pipeline, and key metrics. This centralized hub gives you real-time visibility into your business operations and helps you make data-driven decisions.",
      keyBenefits: [
        "Real-time performance monitoring and metrics tracking",
        "Visual lead conversion pipeline with stage-by-stage analysis",
        "Comprehensive analytics for lead sources and conversion rates",
        "Customizable date ranges for trend analysis and reporting",
        "Export capabilities for client presentations and team meetings"
      ],
      targetUsers: [
        "Real estate agents and brokers",
        "Property managers and teams",
        "Real estate agency owners and managers",
        "Sales managers and team leaders"
      ],
      prerequisites: [
        "Active ACS account with email integration",
        "Basic understanding of real estate metrics",
        "Minimum 30 days of data for meaningful analytics"
      ]
    },
    documentation: {
      setupGuide: {
        title: "Dashboard Setup and Configuration",
        steps: [
          {
            step: 1,
            title: "Access Dashboard",
            description: "Navigate to the main dashboard from the left sidebar. The dashboard will automatically load with your current data.",
            estimatedTime: "1-2 minutes"
          },
          {
            step: 2,
            title: "Configure Date Range",
            description: "Use the date picker in the top-right corner to select your preferred time period for analysis.",
            estimatedTime: "30 seconds"
          },
          {
            step: 3,
            title: "Review Lead Funnel",
            description: "Examine the lead conversion pipeline to understand your current lead flow and identify bottlenecks.",
            estimatedTime: "2-3 minutes"
          },
          {
            step: 4,
            title: "Customize Metrics",
            description: "Click on individual metric cards to drill down into detailed views and export data.",
            estimatedTime: "1-2 minutes"
          },
          {
            step: 5,
            title: "Set Up Alerts",
            description: "Configure performance alerts in Settings to get notified of significant changes in your metrics.",
            estimatedTime: "3-5 minutes"
          }
        ]
      },
      configuration: {
        title: "Dashboard Configuration Options",
        options: [
          {
            name: "Default Date Range",
            description: "Set the default time period shown when opening the dashboard",
            defaultValue: "Last 30 days",
            possibleValues: ["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months", "Custom range"],
            impact: "Affects initial dashboard load time and data relevance"
          },
          {
            name: "Metric Display",
            description: "Choose which key metrics to display prominently on the dashboard",
            defaultValue: "All metrics",
            possibleValues: ["All metrics", "Custom selection", "Performance only", "Lead-focused"],
            impact: "Customizes dashboard layout and focuses on most important data"
          },
          {
            name: "Auto-refresh Interval",
            description: "How often the dashboard automatically updates with new data",
            defaultValue: "5 minutes",
            possibleValues: ["1 minute", "5 minutes", "15 minutes", "30 minutes", "Manual only"],
            impact: "Balances real-time updates with system performance"
          }
        ]
      }
    },
    advancedUsage: {
      bestPractices: [
        {
          title: "Regular Performance Reviews",
          description: "Schedule weekly dashboard reviews to track progress and identify trends",
          examples: [
            "Set aside 30 minutes every Monday morning for dashboard review",
            "Compare week-over-week and month-over-month performance",
            "Document insights and action items from each review"
          ],
          benefits: [
            "Early identification of performance issues",
            "Proactive strategy adjustments",
            "Better goal setting and tracking"
          ]
        },
        {
          title: "Lead Source Analysis",
          description: "Use analytics to identify your most effective lead sources and optimize marketing spend",
          examples: [
            "Track conversion rates by lead source (website, referrals, social media)",
            "Calculate cost per acquisition for each source",
            "Allocate budget based on ROI analysis"
          ],
          benefits: [
            "Improved marketing ROI",
            "Better resource allocation",
            "Increased lead quality"
          ]
        },
        {
          title: "Pipeline Optimization",
          description: "Regularly analyze your lead funnel to identify and fix bottlenecks",
          examples: [
            "Monitor time spent in each funnel stage",
            "Identify stages with high drop-off rates",
            "Implement targeted improvements for weak stages"
          ],
          benefits: [
            "Faster lead conversion",
            "Higher overall conversion rates",
            "Better client experience"
          ]
        }
      ],
      optimization: [
        {
          title: "Performance Benchmarking",
          description: "Compare your metrics against industry standards and set realistic goals",
          implementation: "Research industry benchmarks and set quarterly improvement targets",
          expectedImprovement: "15-25% improvement in conversion rates within 6 months"
        },
        {
          title: "Data-Driven Decision Making",
          description: "Use dashboard insights to inform business strategy and resource allocation",
          implementation: "Create monthly reports based on dashboard data and share with team",
          expectedImprovement: "More strategic business decisions and improved team performance"
        }
      ],
      integration: [
        {
          title: "CRM Integration",
          description: "Connect dashboard data with your existing CRM system for comprehensive tracking",
          setupSteps: [
            "Export dashboard data in CSV format",
            "Import into your CRM system",
            "Set up automated data sync if available"
          ],
          compatibility: ["Salesforce", "HubSpot", "Zoho CRM", "Pipedrive"]
        }
      ]
    },
    troubleshooting: {
      commonIssues: [
        {
          issue: "Dashboard not loading or showing outdated data",
          symptoms: [
            "Dashboard takes more than 30 seconds to load",
            "Metrics show data from several days ago",
            "Error messages appear on dashboard"
          ],
          causes: [
            "Slow internet connection",
            "Browser cache issues",
            "Email integration problems",
            "System maintenance or updates"
          ],
          solutions: [
            {
              title: "Clear Browser Cache",
              steps: [
                "Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)",
                "Select 'Cached images and files'",
                "Click 'Clear data'",
                "Refresh the dashboard page"
              ],
              verification: "Dashboard should load within 10-15 seconds with current data"
            },
            {
              title: "Check Email Integration",
              steps: [
                "Go to Settings → Email Configuration",
                "Verify email connection status",
                "Re-authenticate if necessary",
                "Wait 5-10 minutes for data sync"
              ],
              verification: "New emails should appear in the Email tab"
            }
          ],
          prevention: [
            "Regular browser cache clearing",
            "Monitor email integration status",
            "Use supported browsers (Chrome, Firefox, Safari, Edge)"
          ]
        }
      ],
      performance: [
        {
          metric: "Dashboard Load Time",
          normalRange: "5-15 seconds",
          warningThreshold: "15-30 seconds",
          criticalThreshold: "30+ seconds",
          optimizationTips: [
            "Use a wired internet connection when possible",
            "Close unnecessary browser tabs",
            "Clear browser cache regularly",
            "Use the latest version of supported browsers"
          ]
        }
      ],
      support: {
        documentation: [
          "Dashboard User Guide",
          "Analytics Best Practices",
          "Troubleshooting Guide"
        ],
        community: [
          "ACS User Community Forum",
          "Real Estate Professionals Group",
          "Monthly Webinar Series"
        ],
        contactInfo: {
          email: "support@automatedconsultancy.com",
        }
      }
    },
    examples: {
      templates: [
        {
          name: "Weekly Performance Report",
          description: "Template for creating weekly performance summaries for team meetings",
          useCase: "Team meetings, client presentations, performance reviews",
          code: "Export dashboard data and use provided template for formatting",
          customization: [
            "Add company logo and branding",
            "Include specific metrics relevant to your business",
            "Add commentary and insights section"
          ]
        }
      ],
      caseStudies: [
        {
          title: "Increased Conversion Rate by 40%",
          client: "ABC Real Estate Team",
          challenge: "Low lead conversion rate and poor visibility into pipeline performance",
          solution: "Implemented regular dashboard reviews and data-driven optimization strategies",
          results: [
            "40% increase in lead conversion rate",
            "25% reduction in time to close",
            "Improved team accountability and performance"
          ],
          lessons: [
            "Regular data review is essential for improvement",
            "Team buy-in is crucial for success",
            "Small optimizations compound over time"
          ]
        }
      ],
      workflows: [
        {
          name: "Daily Dashboard Review",
          description: "Quick daily check-in to monitor performance and identify immediate actions needed",
          steps: [
            {
              step: 1,
              action: "Open Dashboard",
              description: "Start each day by opening the dashboard",
              automation: false,
              estimatedTime: "30 seconds"
            },
            {
              step: 2,
              action: "Review Key Metrics",
              description: "Check lead count, conversion rates, and recent activity",
              automation: false,
              estimatedTime: "2 minutes"
            },
            {
              step: 3,
              action: "Identify Actions",
              description: "Note any immediate actions needed based on data",
              automation: false,
              estimatedTime: "1 minute"
            }
          ],
          efficiency: "3-4 minutes daily for significant performance insights"
        }
      ]
    },
    updates: {
      versionHistory: [
        {
          version: "1.0.0",
          date: "2024-01-01",
          changes: ["Initial release of Dashboard & Analytics", "Added lead funnel visualization", "Enabled custom date range analytics"]
        },
        {
          version: "1.1.0",
          date: "2024-03-15",
          changes: ["Performance improvements", "Added export to PDF/Excel", "Enhanced lead source attribution"]
        }
      ],
      roadmap: [
        {
          quarter: "Q3 2024",
          features: [
            {
              title: "Automated Insights",
              description: "AI-generated recommendations for pipeline optimization",
              priority: "high",
              status: "planned"
            },
            {
              title: "Custom Dashboard Widgets",
              description: "User-configurable dashboard components",
              priority: "medium",
              status: "planned"
            }
          ]
        }
      ]
    }
  },
  'Conversation Management': {
    overview: {
      summary: "Conversation Management centralizes all client communications, leveraging AI to score and prioritize leads based on engagement. The unified inbox, advanced filtering, and AI insights help agents focus on high-value conversations and improve response quality.",
      keyBenefits: [
        "Unified inbox for all channels (email, web, SMS)",
        "AI-powered Engagement Value (EV) scoring (0-100)",
        "Advanced filtering by status, score, and type",
        "Full message history and AI-generated insights",
        "Quick actions for follow-up and lead nurturing"
      ],
      targetUsers: [
        "Real estate agents and brokers",
        "Sales teams and managers",
        "Customer service representatives"
      ],
      prerequisites: [
        "Active ACS account",
        "Email integration setup",
        "Basic understanding of lead scoring"
      ]
    },
    documentation: {
      setupGuide: {
        title: "Conversation Management Setup",
        steps: [
          { step: 1, title: "Access Conversations", description: "Navigate to the Conversations tab in the dashboard", estimatedTime: "1 minute" },
          { step: 2, title: "Review EV Scores", description: "Understand how AI assigns engagement values to conversations", estimatedTime: "2-3 minutes" },
          { step: 3, title: "Use Filters", description: "Filter conversations by score ranges and status", estimatedTime: "1-2 minutes" },
          { step: 4, title: "Respond & Nurture", description: "Use quick actions and templates to reply and nurture leads", estimatedTime: "5-10 minutes per lead" }
        ]
      },
      configuration: {
        title: "Conversation Configuration",
        options: [
          { name: "Score Thresholds", description: "Customize score ranges for Hot, Warm, and Cold leads", defaultValue: "Hot: 80+, Warm: 60-79, Cold: <60", possibleValues: ["Default", "Custom"], impact: "Affects lead prioritization" },
          { name: "Inbox Filters", description: "Configure default filters for conversation view", defaultValue: "All", possibleValues: ["All", "Hot", "Warm", "Cold"], impact: "Streamlines daily workflow" }
        ]
      }
    },
    advancedUsage: {
      bestPractices: [
        { title: "Prioritize Hot Leads", description: "Start each day by addressing conversations with the highest EV scores.", examples: ["Filter by Hot (80+)", "Respond within 2 hours"], benefits: ["Maximize conversion", "Reduce lead loss"] },
        { title: "Leverage AI Insights", description: "Use AI-generated suggestions to tailor responses and improve engagement.", examples: ["Review AI summary before replying"], benefits: ["Personalized communication", "Higher engagement"] }
      ],
      optimization: [
        { title: "Template Usage", description: "Use and customize templates for faster, consistent replies.", implementation: "Access templates from compose window.", expectedImprovement: "30% reduction in response time" }
      ],
      integration: [
        { title: "CRM Sync", description: "Sync conversation data with external CRM.", setupSteps: ["Enable CRM integration in settings", "Map fields", "Test sync"], compatibility: ["Salesforce", "HubSpot"] }
      ]
    },
    troubleshooting: {
      commonIssues: [
        { issue: "Low EV Scores", symptoms: ["Leads <60"], causes: ["Poor response times", "Generic replies"], solutions: [{ title: "Improve Engagement", steps: ["Personalize messages", "Respond faster"], verification: "EV score increases" }], prevention: ["Set response SLAs", "Use AI suggestions"] }
      ],
      performance: [
        { metric: "Response Time", normalRange: "<2 hours", warningThreshold: "2-6 hours", criticalThreshold: ">6 hours", optimizationTips: ["Enable notifications", "Use templates"] }
      ],
      support: { documentation: ["Conversation FAQ"], community: ["ACS User Forum"], contactInfo: { email: "support@automatedconsultancy.com" } }
    },
    examples: {
      templates: [
        { name: "Initial Outreach", description: "Template for first contact", useCase: "New lead", code: "Hi [Name], thanks for reaching out...", customization: ["Personalize greeting", "Add property details"] }
      ],
      caseStudies: [
        { title: "Boosting Engagement", client: "Urban Realty", challenge: "Low response rates", solution: "Used AI insights and templates", results: ["+40% engagement"], lessons: ["Personalization matters"] }
      ],
      workflows: [
        { name: "Daily Conversation Review", description: "Routine for reviewing and responding to conversations", steps: [ { step: 1, action: "Filter Hot Leads", description: "Start with high EV", automation: true, estimatedTime: "5 min" }, { step: 2, action: "Reply & Nurture", description: "Respond and move leads forward", automation: false, estimatedTime: "15 min" } ], efficiency: "20 min daily, 25% faster replies" }
      ]
    },
    updates: {
      versionHistory: [ { version: "1.0.0", date: "2024-01-01", changes: ["Initial release"] } ],
      roadmap: [ { quarter: "Q4 2024", features: [ { title: "Multi-channel Messaging", description: "Add SMS and WhatsApp integration", priority: "high", status: "planned" } ] } ]
    }
  },
  'Lead Management': {
    overview: {
      summary: "Lead Management provides a comprehensive system for tracking, prioritizing, and nurturing potential clients. With AI-powered scoring, status tracking, and quick actions, agents can focus on the most promising leads and streamline their workflow.",
      keyBenefits: [
        "Centralized dashboard for all leads",
        "AI-powered lead scoring and prioritization",
        "Status tracking for hot, warm, and cold leads",
        "Quick actions for email, call, and scheduling",
        "Seamless integration with conversation and contact management"
      ],
      targetUsers: [
        "Real estate agents and brokers",
        "Sales teams and managers",
        "Lead generation specialists"
      ],
      prerequisites: [
        "Active ACS account",
        "Email integration setup",
        "Understanding of lead scoring system"
      ]
    },
    documentation: {
      setupGuide: {
        title: "Lead Management Setup",
        steps: [
          { step: 1, title: "Access Leads Dashboard", description: "Navigate to the Leads tab from the sidebar.", estimatedTime: "1 minute" },
          { step: 2, title: "Review Lead List", description: "View all leads with key details and AI scores.", estimatedTime: "2-3 minutes" },
          { step: 3, title: "Sort & Filter", description: "Use filters to focus on hot, warm, or cold leads.", estimatedTime: "1-2 minutes" },
          { step: 4, title: "Take Quick Actions", description: "Email, call, or schedule with leads directly from the dashboard.", estimatedTime: "5-10 minutes per lead" }
        ]
      },
      configuration: {
        title: "Lead Management Configuration",
        options: [
          { name: "Lead Status Definitions", description: "Customize what qualifies as hot, warm, or cold.", defaultValue: "Hot: 80+, Warm: 60-79, Cold: <60", possibleValues: ["Default", "Custom"], impact: "Affects prioritization and workflow" },
          { name: "Quick Actions", description: "Enable/disable quick action buttons.", defaultValue: "Enabled", possibleValues: ["Enabled", "Disabled"], impact: "Streamlines lead engagement" }
        ]
      }
    },
    advancedUsage: {
      bestPractices: [
        { title: "Daily Lead Review", description: "Review and update lead statuses each day.", examples: ["Sort by AI score", "Update status after each interaction"], benefits: ["Stay organized", "Maximize conversion opportunities"] },
        { title: "Consistent Follow-Up", description: "Use reminders and quick actions to maintain regular contact.", examples: ["Schedule follow-ups", "Send personalized emails"], benefits: ["Improved engagement", "Reduced lead loss"] }
      ],
      optimization: [
        { title: "AI Score Utilization", description: "Focus on high-scoring leads for best results.", implementation: "Sort leads by score and prioritize outreach.", expectedImprovement: "20% higher conversion rates" }
      ],
      integration: [
        { title: "Contact Sync", description: "Link leads to contact records for full client history.", setupSteps: ["Add new contact from lead", "Link existing contact"], compatibility: ["ACS Contacts"] }
      ]
    },
    troubleshooting: {
      commonIssues: [
        { issue: "Leads Not Updating", symptoms: ["Stale status", "Missing new leads"], causes: ["Email integration issues", "Manual update required"], solutions: [{ title: "Check Integration", steps: ["Verify email connection", "Refresh dashboard"], verification: "Leads update as expected" }], prevention: ["Regularly check integration status"] }
      ],
      performance: [
        { metric: "Lead Response Time", normalRange: "<24 hours", warningThreshold: "24-48 hours", criticalThreshold: ">48 hours", optimizationTips: ["Set reminders", "Use quick actions"] }
      ],
      support: { documentation: ["Lead Management FAQ"], community: ["ACS User Forum"], contactInfo: { email: "support@automatedconsultancy.com" } }
    },
    examples: {
      templates: [
        { name: "Follow-Up Email", description: "Template for following up with a lead", useCase: "Lead hasn't responded in 3 days", code: "Hi [Name], just checking in...", customization: ["Personalize message", "Add property details"] }
      ],
      caseStudies: [
        { title: "Improved Lead Conversion", client: "Green Valley Realty", challenge: "Low engagement from new leads", solution: "Used AI scoring and daily follow-ups", results: ["+25% conversion"], lessons: ["Consistent follow-up is key"] }
      ],
      workflows: [
        { name: "Lead Prioritization Routine", description: "Daily process for prioritizing and engaging leads", steps: [ { step: 1, action: "Sort by Score", description: "Identify top leads", automation: true, estimatedTime: "5 min" }, { step: 2, action: "Engage", description: "Send email or call", automation: false, estimatedTime: "10 min" } ], efficiency: "15 min daily, 20% more conversions" }
      ]
    },
    updates: {
      versionHistory: [ { version: "1.0.0", date: "2024-01-01", changes: ["Initial release"] } ],
      roadmap: [ { quarter: "Q1 2025", features: [ { title: "Automated Lead Nurturing", description: "AI-driven follow-up sequences", priority: "high", status: "planned" } ] } ]
    }
  },
  'Email Management': {
    overview: {
      summary: "Email Management streamlines all inbound and outbound communications, supporting any email domain. The system automatically categorizes, sorts, and enables efficient responses to client emails, ensuring no opportunity is missed.",
      keyBenefits: [
        "Unified inbox for all business emails",
        "Works with any email domain (Gmail, Outlook, custom, etc.)",
        "Automatic categorization (lead, client, hot-lead, junk)",
        "Template library for fast, consistent replies",
        "Spam management and recovery"
      ],
      targetUsers: [
        "Real estate professionals",
        "Sales teams",
        "Client support staff"
      ],
      prerequisites: [
        "Active ACS account",
        "Email integration configured"
      ]
    },
    documentation: {
      setupGuide: {
        title: "Email Management Setup",
        steps: [
          { step: 1, title: "Connect Email Account", description: "Go to Settings → Email Configuration and connect your business email (any domain supported).", estimatedTime: "2 minutes" },
          { step: 2, title: "Review Inbox", description: "Access the Email tab to view all inbound and outbound messages.", estimatedTime: "1 minute" },
          { step: 3, title: "Use Templates", description: "Reply using pre-built or custom templates for common scenarios.", estimatedTime: "1-2 minutes per email" },
          { step: 4, title: "Check Junk Folder", description: "Regularly review the junk folder for misclassified emails.", estimatedTime: "1 minute" }
        ]
      },
      configuration: {
        title: "Email Management Configuration",
        options: [
          { name: "Template Library", description: "Manage and customize email templates.", defaultValue: "Default templates provided", possibleValues: ["Default", "Custom"], impact: "Improves response speed and consistency" },
          { name: "Email Categories", description: "Configure automatic sorting rules.", defaultValue: "Enabled", possibleValues: ["Enabled", "Disabled"], impact: "Keeps inbox organized" }
        ]
      }
    },
    advancedUsage: {
      bestPractices: [
        { title: "Template Personalization", description: "Customize templates for each client to increase engagement.", examples: ["Add client name", "Reference property details"], benefits: ["Higher response rates", "More personal touch"] },
        { title: "Junk Folder Review", description: "Check the junk folder daily to recover important emails.", examples: ["Move valid emails to inbox"], benefits: ["No missed opportunities"] }
      ],
      optimization: [
        { title: "Category Rules Tuning", description: "Adjust sorting rules to match your workflow.", implementation: "Edit category settings in Email tab.", expectedImprovement: "Inbox accuracy improved by 15%" }
      ],
      integration: [
        { title: "Contact Linkage", description: "Link emails to contact records for full communication history.", setupSteps: ["Open email", "Link to contact"], compatibility: ["ACS Contacts"] }
      ]
    },
    troubleshooting: {
      commonIssues: [
        { issue: "Emails Not Syncing", symptoms: ["Missing emails", "Delayed delivery"], causes: ["Integration error", "Provider outage"], solutions: [{ title: "Reconnect Email", steps: ["Go to Settings", "Reconnect account"], verification: "Emails appear in inbox" }], prevention: ["Monitor integration status"] }
      ],
      performance: [
        { metric: "Email Delivery Time", normalRange: "<5 minutes", warningThreshold: "5-15 minutes", criticalThreshold: ">15 minutes", optimizationTips: ["Check provider status", "Reconnect if needed"] }
      ],
      support: { documentation: ["Email Management FAQ"], community: ["ACS User Forum"], contactInfo: { email: "support@automatedconsultancy.com" } }
    },
    examples: {
      templates: [
        { name: "Appointment Confirmation", description: "Confirm a property viewing via email", useCase: "Client books a viewing", code: "Hi [Name], your viewing is confirmed for...", customization: ["Add property address", "Include agent contact info"] }
      ],
      caseStudies: [
        { title: "Efficient Email Handling", client: "Sunrise Realty", challenge: "Overwhelmed by email volume", solution: "Used categories and templates", results: ["Faster response times"], lessons: ["Automation saves time"] }
      ],
      workflows: [
        { name: "Morning Email Review", description: "Routine for reviewing and responding to emails", steps: [ { step: 1, action: "Check Inbox", description: "Review new emails", automation: true, estimatedTime: "5 min" }, { step: 2, action: "Reply & Categorize", description: "Respond and sort emails", automation: false, estimatedTime: "10 min" } ], efficiency: "15 min daily, 20% fewer missed emails" }
      ]
    },
    updates: {
      versionHistory: [ { version: "1.0.0", date: "2024-01-01", changes: ["Initial release"] } ],
      roadmap: [ { quarter: "Q2 2025", features: [ { title: "Advanced Spam Filtering", description: "AI-powered spam detection", priority: "medium", status: "planned" } ] } ]
    }
  },
  'Contact Management': {
    overview: {
      summary: "Contact Management organizes all client information, tracks relationships, and links contacts to leads and conversations. The system supports efficient search, filtering, and note-taking, with export functionality coming soon.",
      keyBenefits: [
        "Centralized contact database",
        "Status and type tracking (buyer, seller, investor, etc.)",
        "Quick search and advanced filtering",
        "Detailed notes and history for each contact",
        "Export feature coming soon"
      ],
      targetUsers: [
        "Real estate professionals",
        "Sales and support teams"
      ],
      prerequisites: [
        "Active ACS account"
      ]
    },
    documentation: {
      setupGuide: {
        title: "Contact Management Setup",
        steps: [
          { step: 1, title: "Add New Contact", description: "Click 'Add Contact' and fill in required information.", estimatedTime: "2 minutes" },
          { step: 2, title: "Update Contact Details", description: "Edit contact info and add notes as needed.", estimatedTime: "1 minute" },
          { step: 3, title: "Search & Filter", description: "Use search and filters to find contacts quickly.", estimatedTime: "1 minute" },
          { step: 4, title: "Link to Leads/Conversations", description: "Associate contacts with leads and conversation history.", estimatedTime: "1 minute" }
        ]
      },
      configuration: {
        title: "Contact Management Configuration",
        options: [
          { name: "Contact Types", description: "Define and manage contact types (buyer, seller, etc.)", defaultValue: "Buyer, Seller, Investor", possibleValues: ["Default", "Custom"], impact: "Improves organization" },
          { name: "Export Contacts", description: "Export all contacts to CSV or Excel (coming soon)", defaultValue: "Coming soon", possibleValues: ["N/A"], impact: "Will enable data portability" }
        ]
      }
    },
    advancedUsage: {
      bestPractices: [
        { title: "Regular Updates", description: "Keep contact information current for all clients.", examples: ["Monthly review of contact list"], benefits: ["Accurate records", "Better client relationships"] },
        { title: "Detailed Notes", description: "Maintain detailed notes for each contact.", examples: ["Add notes after every call or meeting"], benefits: ["Personalized service", "Improved follow-up"] }
      ],
      optimization: [
        { title: "Tagging & Categorization", description: "Use tags and categories for targeted outreach.", implementation: "Assign tags in contact details.", expectedImprovement: "Faster segmentation and outreach" }
      ],
      integration: [
        { title: "Lead & Conversation Linkage", description: "Link contacts to all related leads and conversations.", setupSteps: ["Open contact profile", "Link to lead or conversation"], compatibility: ["ACS Leads", "ACS Conversations"] }
      ]
    },
    troubleshooting: {
      commonIssues: [
        { issue: "Missing Contacts", symptoms: ["Contact not found in search"], causes: ["Typo in search", "Contact not added"], solutions: [{ title: "Check Spelling/Add Contact", steps: ["Verify spelling", "Add new contact if missing"], verification: "Contact appears in search" }], prevention: ["Regularly update contact list"] }
      ],
      performance: [
        { metric: "Contact Search Time", normalRange: "<2 seconds", warningThreshold: "2-5 seconds", criticalThreshold: ">5 seconds", optimizationTips: ["Use filters", "Limit search to active contacts"] }
      ],
      support: { documentation: ["Contact Management FAQ"], community: ["ACS User Forum"], contactInfo: { email: "support@automatedconsultancy.com" } }
    },
    examples: {
      templates: [
        { name: "New Contact Entry", description: "Template for adding a new contact", useCase: "Onboarding a new client", code: "Name, Email, Phone, Type, Notes", customization: ["Add tags", "Link to lead"] }
      ],
      caseStudies: [
        { title: "Organized Client Database", client: "Blue Sky Realty", challenge: "Disorganized contact records", solution: "Used tags and regular updates", results: ["Faster outreach"], lessons: ["Organization saves time"] }
      ],
      workflows: [
        { name: "Monthly Contact Review", description: "Routine for keeping contact info up to date", steps: [ { step: 1, action: "Review List", description: "Check all contacts for accuracy", automation: false, estimatedTime: "15 min" }, { step: 2, action: "Update Details", description: "Edit outdated info", automation: false, estimatedTime: "10 min" } ], efficiency: "25 min monthly, fewer missed opportunities" }
      ]
    },
    updates: {
      versionHistory: [ { version: "1.0.0", date: "2024-01-01", changes: ["Initial release"] } ],
      roadmap: [ { quarter: "Q3 2025", features: [ { title: "Export Contacts", description: "Export contacts to CSV/Excel", priority: "high", status: "planned" } ] } ]
    }
  }
};

// QUESTIONS FOR USER:
// 1. Should the 'Lead Management' section include advanced lead routing/assignment features?
// 2. For 'Email Management', do you want to highlight integration with external email providers (Gmail, Outlook)?
// 3. Should 'Contact Management' include import/export and bulk update features?
// 4. Are there any compliance/privacy requirements to emphasize in any of these features?
// 5. Should we include more real-world case studies or user testimonials for each feature? 
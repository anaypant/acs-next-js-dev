import React, { useState } from 'react';
import { 
  BookOpen, 
  BarChart2, 
  Users, 
  MessageSquare, 
  Calendar,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Target,
  TrendingUp,
  Zap,
  Shield,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ResourceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  category: 'getting-started' | 'best-practices' | 'analytics' | 'features' | 'security' | 'troubleshooting';
  tips?: string[];
  estimatedTime?: string;
  priority?: 'high' | 'medium' | 'low';
}

const resourceItems: ResourceItem[] = [
  {
    title: "Getting Started Guide",
    description: "Essential setup and navigation tips for new users",
    icon: <BookOpen className="h-5 w-5" />,
    href: "/dashboard/resources/getting-started",
    category: "getting-started",
    tips: ["Complete email setup first", "Review dashboard metrics", "Explore conversation features"],
    estimatedTime: "10 min",
    priority: "high"
  },
  {
    title: "Lead Conversion Best Practices",
    description: "Proven strategies to improve your conversion rates",
    icon: <Target className="h-5 w-5" />,
    href: "/dashboard/resources/best-practices",
    category: "best-practices",
    tips: ["Respond within 5 minutes", "Personalize your messages", "Follow up consistently"],
    estimatedTime: "15 min",
    priority: "high"
  },
  {
    title: "Analytics Deep Dive",
    description: "Understanding your performance metrics and trends",
    icon: <BarChart2 className="h-5 w-5" />,
    href: "/dashboard/analytics",
    category: "analytics",
    tips: ["Monitor conversion rates", "Track lead sources", "Analyze response times"],
    estimatedTime: "20 min",
    priority: "medium"
  },
  {
    title: "Advanced Features Guide",
    description: "Master advanced ACS features and automation",
    icon: <TrendingUp className="h-5 w-5" />,
    href: "/dashboard/resources/advanced-features",
    category: "features",
    tips: ["Set up email templates", "Configure auto-responses", "Use AI insights"],
    estimatedTime: "25 min",
    priority: "medium"
  },
  {
    title: "Contact Management",
    description: "Organize and manage your client relationships",
    icon: <Users className="h-5 w-5" />,
    href: "/dashboard/contacts",
    category: "features",
    tips: ["Keep contact info updated", "Add notes to contacts", "Use tags for organization"],
    estimatedTime: "12 min",
    priority: "medium"
  },
  {
    title: "Calendar Integration",
    description: "Sync your schedule and manage appointments",
    icon: <Calendar className="h-5 w-5" />,
    href: "/dashboard/calendar",
    category: "features",
    tips: ["Connect your calendar", "Set up viewing reminders", "Block unavailable times"],
    estimatedTime: "8 min",
    priority: "low"
  },
  {
    title: "Security Best Practices",
    description: "Keep your account and data secure",
    icon: <Shield className="h-5 w-5" />,
    href: "/dashboard/resources/security",
    category: "security",
    tips: ["Use strong passwords", "Enable 2FA", "Review access logs"],
    estimatedTime: "10 min",
    priority: "high"
  },
  {
    title: "Troubleshooting Guide",
    description: "Common issues and their solutions",
    icon: <HelpCircle className="h-5 w-5" />,
    href: "/dashboard/resources/troubleshooting",
    category: "troubleshooting",
    tips: ["Check email settings", "Verify API connections", "Clear browser cache"],
    estimatedTime: "15 min",
    priority: "low"
  }
];

interface QuickResourcesProps {
  className?: string;
}

export function QuickResources({ className }: QuickResourcesProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getCategoryColor = (category: ResourceItem['category']) => {
    switch (category) {
      case 'getting-started':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'best-practices':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'analytics':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'features':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'security':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'troubleshooting':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: ResourceItem['category']) => {
    switch (category) {
      case 'getting-started':
        return <BookOpen className="h-4 w-4" />;
      case 'best-practices':
        return <Target className="h-4 w-4" />;
      case 'analytics':
        return <BarChart2 className="h-4 w-4" />;
      case 'features':
        return <TrendingUp className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'troubleshooting':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: ResourceItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Sort by priority and category
  const sortedResources = [...resourceItems].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority || 'low'] - priorityOrder[b.priority || 'low'];
    if (priorityDiff !== 0) return priorityDiff;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-sm border border-gray-200/80", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <BookOpen className="h-5 w-5 mr-3 text-[#0e6537]" />
          Quick Resources
        </h2>
        <Link 
          href="/dashboard/resources" 
          className="text-sm text-[#0e6537] hover:text-[#0a4a2a] transition-colors flex items-center"
        >
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedResources.map((item) => (
          <div
            key={item.title}
            className="relative group"
            onMouseEnter={() => setHoveredItem(item.title)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href={item.href}
              className="block p-4 rounded-lg border border-gray-200 hover:border-[#0e6537] hover:shadow-md transition-all duration-200 bg-white hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-[#0e6537]/10 text-[#0e6537]">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#0e6537] transition-colors">
                        {item.title}
                      </h3>
                      {item.priority && (
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                          getPriorityColor(item.priority)
                        )}>
                          {item.priority}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                        getCategoryColor(item.category)
                      )}>
                        {getCategoryIcon(item.category)}
                        <span className="ml-1 capitalize">
                          {item.category.replace('-', ' ')}
                        </span>
                      </span>
                      {item.estimatedTime && (
                        <span className="text-xs text-gray-500">
                          {item.estimatedTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-[#0e6537] transition-colors flex-shrink-0" />
              </div>
            </Link>

            {/* Enhanced Tooltip */}
            {hoveredItem === item.title && item.tips && (
              <div className="absolute z-10 w-80 p-4 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 -top-2 left-full ml-2 transform -translate-y-1/2">
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="text-sm font-medium">Quick Tips</span>
                </div>
                <ul className="space-y-1">
                  {item.tips.map((tip, index) => (
                    <li key={index} className="text-xs text-gray-300 flex items-start">
                      <span className="text-[#0e6537] mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Estimated time:</span>
                    <span className="text-white">{item.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-gray-400">Priority:</span>
                    <span className={cn(
                      "capitalize",
                      item.priority === 'high' ? 'text-red-400' : 
                      item.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                    )}>
                      {item.priority}
                    </span>
                  </div>
                </div>
                <div className="absolute top-1/2 -left-1 w-2 h-2 bg-gray-900 transform -translate-y-1/2 rotate-45 border-l border-b border-gray-700"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
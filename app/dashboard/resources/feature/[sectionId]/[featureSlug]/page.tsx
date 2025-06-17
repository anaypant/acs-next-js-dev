// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { resourcesData, ResourceSection, ResourceItem } from "../../../resources-data";
// import { 
//   ArrowLeft, BookOpen, CheckCircle, Lightbulb, Play, Clock, Target, Users, 
//   HelpCircle, ExternalLink, Star, TrendingUp, Shield, Zap, BarChart3, 
//   MessageSquare, Calendar, Settings, Home, Sparkles, Award, Info, AlertCircle,
//   ChevronRight, Bookmark, Phone, MapPin, FileText, Eye, Lock, Maximize2, Minimize2,
//   Mail
// } from "lucide-react";
// import Link from "next/link";
// import { getDetailedFeatureData } from '../../../feature-data';

// const getSectionIcon = (iconName: string) => {
//   const iconMap: { [key: string]: React.ReactNode } = {
//     "Home": <Home className="w-6 h-6" />,
//     "Zap": <Zap className="w-6 h-6" />,
//     "Sparkles": <Sparkles className="w-6 h-6" />,
//     "Shield": <Shield className="w-6 h-6" />,
//     "TrendingUp": <TrendingUp className="w-6 h-6" />,
//     "Award": <Award className="w-6 h-6" />,
//     "HelpCircle": <HelpCircle className="w-6 h-6" />,
//     "Settings": <Settings className="w-6 h-6" />,
//     "MessageSquare": <MessageSquare className="w-6 h-6" />,
//   };
//   return iconMap[iconName] || <BookOpen className="w-6 h-6" />;
// };

// export default function FeatureDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isLoading, setIsLoading] = useState(true);
//   const [featureData, setFeatureData] = useState<ResourceItem | null>(null);
//   const [sectionData, setSectionData] = useState<ResourceSection | null>(null);
//   const [detailedData, setDetailedData] = useState<any | null>(null);

//   const sectionId = params.sectionId as string;
//   const featureSlug = params.featureSlug as string;

//   useEffect(() => {
//     // Find the section and feature data
//     const section = resourcesData.find(s => s.id === sectionId);
//     if (section) {
//       setSectionData(section);
      
//       // Find the feature by matching the slug
//       const feature = section.content.find(item => {
//         const itemSlug = item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
//         return itemSlug === featureSlug;
//       });
      
//       if (feature) {
//         setFeatureData(feature);
//         setDetailedData(getDetailedFeatureData(sectionId, feature.title));
//       } else {
//         // Feature not found, redirect to resources page
//         router.push('/dashboard/resources');
//       }
//     } else {
//       // Section not found, redirect to resources page
//       router.push('/dashboard/resources');
//     }
    
//     setIsLoading(false);
//   }, [sectionId, featureSlug, router]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0e6537] mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Loading feature details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!featureData || !sectionData || !detailedData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Feature Not Found</h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">The requested feature could not be found.</p>
//           <Link 
//             href="/dashboard/resources"
//             className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0a5a2f] to-[#157a42] text-white rounded-xl hover:from-[#0e6537] hover:to-[#157a42] transition-all duration-200"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             Back to Resources
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: Info },
//     { id: 'documentation', label: 'Documentation', icon: BookOpen },
//     { id: 'advanced', label: 'Advanced Usage', icon: TrendingUp },
//     { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
//     { id: 'examples', label: 'Examples', icon: Star },
//     { id: 'updates', label: 'Updates', icon: Sparkles }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header with Back Arrow */}
//         <div className="mb-8">
//           <Link 
//             href="/dashboard/resources" 
//             className="inline-flex items-center space-x-2 text-[#0e6537] hover:text-[#0a5a2f] transition-colors mb-6 group"
//           >
//             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//             <span className="font-medium">Back to Resources</span>
//           </Link>
          
//           {/* Feature Header */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
//             <div className="flex items-start justify-between mb-6">
//               <div className="flex-1">
//                 <div className="flex items-center space-x-4 mb-4">
//                   <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg" style={{ background: sectionData.colorScheme }}>
//                     <div className="text-white">
//                       {getSectionIcon(sectionData.icon)}
//                     </div>
//                   </div>
//                   <div>
//                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                       {featureData.title}
//                     </h1>
//                     <p className="text-lg text-gray-600 dark:text-gray-400">
//                       {sectionData.title} • {featureData.description}
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* Quick Stats */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
//                     <div className="text-2xl font-bold text-[#0e6537]">5</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-400">Setup Steps</div>
//                   </div>
//                   <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
//                     <div className="text-2xl font-bold text-[#0e6537]">15</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-400">Best Practices</div>
//                   </div>
//                   <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
//                     <div className="text-2xl font-bold text-[#0e6537]">8</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-400">Examples</div>
//                   </div>
//                   <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
//                     <div className="text-2xl font-bold text-[#0e6537]">24/7</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="mb-8">
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
//             <div className="flex overflow-x-auto">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-lg ${
//                     activeTab === tab.id
//                       ? 'text-white shadow-lg'
//                       : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
//                   }`}
//                   style={{
//                     backgroundColor: activeTab === tab.id ? sectionData.colorScheme : 'transparent'
//                   }}
//                 >
//                   <tab.icon className="w-4 h-4" />
//                   <span>{tab.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
//           {activeTab === 'overview' && (
//             <div className="p-8">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Overview Summary */}
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
//                   <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
//                     {detailedData.overview.summary}
//                   </p>
                  
//                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Benefits</h3>
//                   <ul className="space-y-2 mb-6">
//                     {detailedData.overview.keyBenefits.map((benefit: string, index: number) => (
//                       <li key={index} className="flex items-start space-x-3">
//                         <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//                         <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
                
//                 {/* Target Users & Prerequisites */}
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Target Users</h3>
//                   <ul className="space-y-2 mb-6">
//                     {detailedData.overview.targetUsers.map((user: string, index: number) => (
//                       <li key={index} className="flex items-start space-x-3">
//                         <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                         <span className="text-gray-700 dark:text-gray-300">{user}</span>
//                       </li>
//                     ))}
//                   </ul>
                  
//                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Prerequisites</h3>
//                   <ul className="space-y-2">
//                     {detailedData.overview.prerequisites.map((prereq: string, index: number) => (
//                       <li key={index} className="flex items-start space-x-3">
//                         <Shield className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
//                         <span className="text-gray-700 dark:text-gray-300">{prereq}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'documentation' && (
//             <div className="p-8">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Documentation</h2>
              
//               {/* Setup Guide */}
//               <div className="mb-8">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//                   {detailedData.documentation.setupGuide.title}
//                 </h3>
//                 <div className="space-y-4">
//                   {detailedData.documentation.setupGuide.steps.map((step: any, index: number) => (
//                     <div key={index} className="bg-gray-50 dark:bg-gray-750 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
//                       <div className="flex items-start space-x-4">
//                         <div className="w-8 h-8 bg-[#0e6537] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
//                           {step.step}
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
//                           <p className="text-gray-600 dark:text-gray-400 mb-3">{step.description}</p>
//                           <div className="text-sm text-gray-500 dark:text-gray-400">
//                             Estimated time: {step.estimatedTime}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Configuration */}
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//                   {detailedData.documentation.configuration.title}
//                 </h3>
//                 <div className="space-y-4">
//                   {detailedData.documentation.configuration.options.map((opt: any, index: number) => (
//                     <div key={index} className="bg-gray-50 dark:bg-gray-750 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
//                       <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{opt.name}</h4>
//                       <p className="text-gray-600 dark:text-gray-400 mb-3">{opt.description}</p>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <strong className="text-gray-700 dark:text-gray-300">Default Value:</strong>
//                           <p className="text-gray-600 dark:text-gray-400">{opt.defaultValue}</p>
//                         </div>
//                         <div>
//                           <strong className="text-gray-700 dark:text-gray-300">Impact:</strong>
//                           <p className="text-gray-600 dark:text-gray-400">{opt.impact}</p>
//                         </div>
//                       </div>
//                       <div className="mt-2">
//                         <strong className="text-gray-700 dark:text-gray-300">Possible Values:</strong>
//                         <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
//                           {opt.possibleValues.map((val: string, idx: number) => (
//                             <li key={idx}>{val}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'advanced' && (
//             <div className="p-8">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Advanced Usage</h2>
              
//               {/* Best Practices */}
//               <div className="mb-8">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Best Practices</h3>
//                 <div className="space-y-4">
//                   {detailedData.advancedUsage.bestPractices.map((practice: any, index: number) => (
//                     <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
//                       <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{practice.title}</h4>
//                       <p className="text-gray-600 dark:text-gray-400 mb-3">{practice.description}</p>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <strong className="text-blue-600 dark:text-blue-400">Examples:</strong>
//                           <ul className="text-sm text-gray-700 dark:text-gray-300 mt-1 space-y-1">
//                             {practice.examples.map((example: string, idx: number) => (
//                               <li key={idx} className="flex items-start space-x-2">
//                                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                                 <span>{example}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                         <div>
//                           <strong className="text-blue-600 dark:text-blue-400">Benefits:</strong>
//                           <ul className="text-sm text-gray-700 dark:text-gray-300 mt-1 space-y-1">
//                             {practice.benefits.map((benefit: string, idx: number) => (
//                               <li key={idx} className="flex items-start space-x-2">
//                                 <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                 <span>{benefit}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Optimization */}
//               <div className="mb-8">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Optimization</h3>
//                 <div className="space-y-4">
//                   {detailedData.advancedUsage.optimization.map((opt, index) => (
//                     <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
//                       <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{opt.title}</h4>
//                       <p className="text-gray-600 dark:text-gray-400 mb-3">{opt.description}</p>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <strong className="text-green-600 dark:text-green-400">Implementation:</strong>
//                           <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{opt.implementation}</p>
//                         </div>
//                         <div>
//                           <strong className="text-green-600 dark:text-green-400">Expected Improvement:</strong>
//                           <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{opt.expectedImprovement}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'troubleshooting' && (
//             <div className="p-8">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Troubleshooting</h2>
              
//               {/* Common Issues */}
//               <div className="mb-8">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Common Issues</h3>
//                 <div className="space-y-4">
//                   {detailedData.troubleshooting.commonIssues.map((issue: any, index: number) => (
//                     <div key={index} className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
//                       <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{issue.issue}</h4>
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                         <div>
//                           <strong className="text-red-600 dark:text-red-400">Symptoms:</strong>
//                           <ul className="text-sm text-gray-700 dark:text-gray-300 mt-1 space-y-1">
//                             {issue.symptoms.map((symptom: string, idx: number) => (
//                               <li key={idx} className="flex items-start space-x-2">
//                                 <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
//                                 <span>{symptom}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                         <div>
//                           <strong className="text-red-600 dark:text-red-400">Solutions:</strong>
//                           <ul className="text-sm text-gray-700 dark:text-gray-300 mt-1 space-y-1">
//                             {issue.solutions.map((solution: any, idx: number) => (
//                               <li key={idx} className="flex items-start space-x-2">
//                                 <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                 <span>{solution.title}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Support Information */}
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
//                 <div className="bg-gray-50 dark:bg-gray-750 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h4>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex items-center space-x-2">
//                           <Mail className="w-4 h-4 text-gray-500" />
//                           <span className="text-gray-700 dark:text-gray-300">{detailedData.troubleshooting.support.contactInfo.email}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Phone className="w-4 h-4 text-gray-500" />
//                           <span className="text-gray-700 dark:text-gray-300">{detailedData.troubleshooting.support.contactInfo.phone}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <MessageSquare className="w-4 h-4 text-gray-500" />
//                           <span className="text-gray-700 dark:text-gray-300">{detailedData.troubleshooting.support.contactInfo.chat}</span>
//                         </div>
//                         <div className="text-xs text-gray-500 dark:text-gray-400">
//                           Response time: {detailedData.troubleshooting.support.contactInfo.responseTime}
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Resources</h4>
//                       <div className="space-y-2 text-sm">
//                         {detailedData.troubleshooting.support.documentation.map((doc: string, idx: number) => (
//                           <div key={idx} className="flex items-center space-x-2">
//                             <BookOpen className="w-4 h-4 text-gray-500" />
//                             <span className="text-gray-700 dark:text-gray-300">{doc}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'examples' && (
//             <div className="p-8">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Examples & Templates</h2>
              
//               {/* Templates */}
//               <div className="mb-8">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Templates</h3>
//                 <div className="space-y-4">
//                   {detailedData.examples.templates.map((template: any, index: number) => (
//                     <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
//                       <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{template.name}</h4>
//                       <p className="text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <strong className="text-purple-600 dark:text-purple-400">Use Case:</strong>
//                           <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{template.useCase}</p>
//                         </div>
//                         <div>
//                           <strong className="text-purple-600 dark:text-purple-400">Customization Options:</strong>
//                           <ul className="text-sm text-gray-700 dark:text-gray-300 mt-1 space-y-1">
//                             {template.customization.map((option: string, idx: number) => (
//                               <li key={idx} className="flex items-start space-x-2">
//                                 <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
//                                 <span>{option}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Case Studies */}
//               <div className="mb-8">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Case Studies</h3>
//                 <div className="space-y-4">
//                   {detailedData.examples.caseStudies.map((study: any, index: number) => (
//                     <div key={index} className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-teal-200 dark:border-teal-800">
//                       <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{study.title}</h4>
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Client: {study.client}</p>
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                         <div>
//                           <strong className="text-teal-600 dark:text-teal-400">Challenge:</strong>
//                           <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{study.challenge}</p>
//                         </div>
//                         <div>
//                           <strong className="text-teal-600 dark:text-teal-400">Solution:</strong>
//                           <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{study.solution}</p>
//                         </div>
//                       </div>
//                       <div className="mt-4">
//                         <strong className="text-teal-600 dark:text-teal-400">Results:</strong>
//                         <ul className="text-sm text-gray-700 dark:text-gray-300 mt-1 space-y-1">
//                           {study.results.map((result: string, idx: number) => (
//                             <li key={idx} className="flex items-start space-x-2">
//                               <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                               <span>{result}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'updates' && (
//             <div className="p-8">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Updates & Roadmap</h2>
              
//               {/* Version History */}
//               <div className="mb-8">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Version History</h3>
//                 <div className="space-y-4">
//                   {detailedData.updates.versionHistory.map((version: any, index: number) => (
//                     <div key={index} className="bg-gray-50 dark:bg-gray-750 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
//                       <div className="flex items-center justify-between mb-3">
//                         <h4 className="font-semibold text-gray-900 dark:text-white">Version {version.version}</h4>
//                         <span className="text-sm text-gray-500 dark:text-gray-400">{version.date}</span>
//                       </div>
//                       <ul className="space-y-1">
//                         {version.changes.map((change: string, idx: number) => (
//                           <li key={idx} className="flex items-start space-x-2 text-sm">
//                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                             <span className="text-gray-700 dark:text-gray-300">{change}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Roadmap */}
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Roadmap</h3>
//                 <div className="space-y-4">
//                   {detailedData.updates.roadmap.map((quarter: any, index: number) => (
//                     <div key={index} className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
//                       <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{quarter.quarter}</h4>
//                       <div className="space-y-3">
//                         {quarter.features.map((feature: any, idx: number) => (
//                           <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
//                             <div className="flex items-center justify-between mb-2">
//                               <h5 className="font-medium text-gray-900 dark:text-white">{feature.title}</h5>
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 feature.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
//                                 feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
//                                 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//                               }`}>
//                                 {feature.priority}
//                               </span>
//                             </div>
//                             <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{feature.description}</p>
//                             <div className="flex items-center space-x-2">
//                               <span className="text-xs text-gray-500 dark:text-gray-400">Status:</span>
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 feature.status === 'released' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
//                                 feature.status === 'testing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
//                                 feature.status === 'in-development' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
//                                 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
//                               }`}>
//                                 {feature.status}
//                               </span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// } 
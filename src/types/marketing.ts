export interface InstagramPostConcept {
  id: string;
  type: 'Product Spotlight' | 'Beauty Recommendation' | 'Promotional Campaign';
  title: string;
  visualDirection: string;
  caption: string;
  hashtags: string[];
  cta: string;
  featuredProductSlug: string;
}

export interface PaidAdConcept {
  id: string;
  platform: 'Instagram & Facebook Feed (Single Image Ad)';
  objective: string;
  targetAudience: string;
  headline: string;
  primaryText: string;
  ctaLabel: string;
  destinationPath: string;
}

export interface WhatsAppBroadcastConcept {
  id: string;
  segment: string;
  timing: string;
  messageBody: string;
  ctaLabel: string;
  targetPath: string;
}

export interface EmailCampaignConcept {
  id: string;
  subjectLine: string;
  preheader: string;
  greeting: string;
  bodyParagraph: string;
  featuredSkus: string[];
  offerLabel: string;
  ctaLabel: string;
}

export interface SimulatedChannelMetric {
  channel: string;
  impressions: number;
  reach: number;
  engagementCount: number;
  clicks: number;
  ctrPercent: number;
  conversions: number;
  conversionRatePercent: number;
  isSimulated: true;
}

export interface PrototypeStage {
  step: number;
  title: string;
  summary: string;
  meikaImplementation: string;
}

export interface UsabilityTestTask {
  code: string;
  title: string;
  scenario: string;
  expectedOutcome: string;
}

export interface UsabilityTestEntry {
  testerSlot: string;
  respondentName: string;
  completedTasks: string;
  durationMinutes: string;
  errorCount: string;
  navigationIssues: string;
  feedbackNotes: string;
  improvementPriority: string;
}


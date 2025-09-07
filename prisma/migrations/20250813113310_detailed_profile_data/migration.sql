-- CreateEnum
CREATE TYPE "public"."Country" AS ENUM ('CANADA', 'AUSTRALIA');

-- CreateEnum
CREATE TYPE "public"."OnboardingStatus" AS ENUM ('COUNTRY_SELECTION', 'PROFILE_CREATION', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."PatternType" AS ENUM ('SUCCESS', 'FAILURE', 'NEUTRAL');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionType" TEXT NOT NULL DEFAULT 'free',
    "lettersGenerated" INTEGER NOT NULL DEFAULT 0,
    "lettersLimit" INTEGER NOT NULL DEFAULT 3,
    "kindeOrgId" TEXT,
    "targetCountry" "public"."Country",
    "onboardingStatus" "public"."OnboardingStatus" NOT NULL DEFAULT 'COUNTRY_SELECTION',
    "onboardingStep" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personalInfo" JSONB NOT NULL,
    "academicBackground" JSONB NOT NULL,
    "targetProgram" JSONB NOT NULL,
    "financialInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "country" "public"."Country" NOT NULL,
    "profileCompleteness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "familyBackground" JSONB,
    "workExperience" JSONB,
    "extracurricularActivities" JSONB,
    "languageProficiency" JSONB,
    "homeCountryTies" JSONB,
    "futureCareerPlans" JSONB,
    "whyThisCountry" JSONB,
    "whyThisUniversity" JSONB,
    "previousVisaHistory" JSONB,
    "sponsorshipDetails" JSONB,
    "maritalStatus" JSONB,
    "passportNumber" TEXT,
    "parentsDetails" JSONB,
    "propertyOwnership" BOOLEAN NOT NULL DEFAULT false,
    "businessOwnership" JSONB,
    "travelingCompanion" JSONB,
    "programStructure" JSONB,
    "tuitionAndCosts" JSONB,
    "strongFamilyBonds" JSONB,
    "countryAdvantages" JSONB,
    "universityRanking" JSONB,
    "accommodationPlans" JSONB,
    "additionalCertifications" JSONB,
    "freelancingExperience" JSONB,
    "salaryExpectations" JSONB,
    "homeCountryOpportunities" JSONB,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."generated_letters" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT,
    "letterType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "modelUsed" TEXT,
    "generationTime" INTEGER,
    "wordCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedbackRating" SMALLINT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "country" "public"."Country" NOT NULL,
    "patternsUsed" TEXT[],
    "confidenceScore" DOUBLE PRECISION,
    "patternMatch" DOUBLE PRECISION,
    "isVisaApproved" BOOLEAN,
    "visaDecisionDate" TIMESTAMP(3),
    "adminNotes" TEXT,
    "rejectionReason" TEXT,

    CONSTRAINT "generated_letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT,
    "fileName" TEXT NOT NULL,
    "blobUrl" TEXT NOT NULL,
    "blobPathname" TEXT NOT NULL,
    "fileSize" INTEGER,
    "contentType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kindeSubscriptionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usage_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."training_data_entries" (
    "id" TEXT NOT NULL,
    "studentData" JSONB NOT NULL,
    "sopContent" TEXT NOT NULL,
    "country" "public"."Country" NOT NULL,
    "isApproved" BOOLEAN NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL,
    "decisionDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "keySuccessFactors" TEXT[],
    "extractedPatterns" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_data_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sop_patterns" (
    "id" TEXT NOT NULL,
    "country" "public"."Country" NOT NULL,
    "patternType" "public"."PatternType" NOT NULL,
    "content" TEXT NOT NULL,
    "keyPhrases" TEXT[],
    "context" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "successRate" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sop_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_userId_country_key" ON "public"."student_profiles"("userId", "country");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_kindeSubscriptionId_key" ON "public"."subscriptions"("kindeSubscriptionId");

-- AddForeignKey
ALTER TABLE "public"."student_profiles" ADD CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generated_letters" ADD CONSTRAINT "generated_letters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generated_letters" ADD CONSTRAINT "generated_letters_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."student_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."student_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usage_logs" ADD CONSTRAINT "usage_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

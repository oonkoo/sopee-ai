-- AlterTable
ALTER TABLE "public"."student_profiles" ADD COLUMN     "additionalLanguageTests" JSONB,
ADD COLUMN     "entrepreneurialPlans" JSONB,
ADD COLUMN     "familyInTargetCountry" JSONB,
ADD COLUMN     "returnPlans" JSONB;

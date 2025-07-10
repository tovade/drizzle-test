#!/usr/bin/env bun
/**
 * Package Update and Breaking Change Monitor
 * 
 * This script helps monitor for package updates and automatically check for breaking changes
 * by running tests and builds after each update.
 */

import { $ } from "bun"

interface PackageInfo {
    name: string
    current: string
    update: string
    latest: string
    risk: 'low' | 'medium' | 'high'
}

// Function to get outdated packages
async function getOutdatedPackages(): Promise<PackageInfo[]> {
    try {
        const result = await $`bun outdated --json`.text()
        
        // Parse the output (note: bun outdated doesn't have --json flag yet, so we'll parse text)
        // For now, we'll run the command and parse manually
        const outdatedResult = await $`bun outdated`.text()
        console.log("Current outdated packages check:")
        console.log(outdatedResult)
        
        return []
    } catch (error) {
        console.error("Error checking outdated packages:", error)
        return []
    }
}

// Function to assess update risk
function assessRisk(current: string, latest: string): 'low' | 'medium' | 'high' {
    const currentParts = current.split('.').map(Number)
    const latestParts = latest.split('.').map(Number)
    
    // Major version change = high risk
    if (latestParts[0] > currentParts[0]) {
        return 'high'
    }
    
    // Minor version change = medium risk
    if (latestParts[1] > currentParts[1]) {
        return 'medium'
    }
    
    // Patch version change = low risk
    return 'low'
}

// Function to run tests and builds
async function runValidationSuite(): Promise<boolean> {
    console.log("🧪 Running validation suite...")
    
    try {
        // Run build
        console.log("🔨 Building project...")
        await $`bun build src/index.ts --target=bun --outfile=/tmp/validation-build.js`
        console.log("✅ Build successful")
        
        // Run tests (excluding database tests that require PostgreSQL)
        console.log("🧪 Running tests...")
        await $`bun test src/test/basic.test.ts src/test/migration.test.ts`
        console.log("✅ Tests passed")
        
        // Check TypeScript compilation
        console.log("📝 Checking TypeScript...")
        await $`bunx tsc --noEmit`
        console.log("✅ TypeScript check passed")
        
        return true
    } catch (error) {
        console.error("❌ Validation failed:", error)
        return false
    }
}

// Function to update packages safely
async function updatePackagesSafely(packages: string[]): Promise<void> {
    for (const pkg of packages) {
        console.log(`📦 Updating ${pkg}...`)
        
        try {
            await $`bun update ${pkg}`
            
            // Run validation after each update
            const isValid = await runValidationSuite()
            
            if (!isValid) {
                console.warn(`⚠️  Breaking changes detected in ${pkg}! Manual intervention required.`)
                // Note: In a real scenario, you might want to revert the update here
                break
            } else {
                console.log(`✅ ${pkg} updated successfully without breaking changes`)
            }
        } catch (error) {
            console.error(`❌ Failed to update ${pkg}:`, error)
            break
        }
    }
}

// Main function
async function main() {
    console.log("🚀 Package Update Monitor Starting...")
    
    // Check current status
    console.log("📊 Checking for outdated packages...")
    await getOutdatedPackages()
    
    // Run initial validation
    console.log("🔍 Running initial validation...")
    const initialValid = await runValidationSuite()
    
    if (!initialValid) {
        console.error("❌ Initial validation failed! Fix issues before updating packages.")
        process.exit(1)
    }
    
    console.log("✅ All validations passed! Current setup is stable.")
    console.log("💡 To update packages safely, run: bun run update-packages")
}

// Export the functions for use in other scripts
export { getOutdatedPackages, assessRisk, runValidationSuite, updatePackagesSafely }

// Run main if this script is executed directly
if (import.meta.main) {
    main().catch(console.error)
}
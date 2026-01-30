// Smart data source selector
import { mockSkills, categories, featuredSkills } from './data.js'
import { SupabaseAPI } from './supabase.js'

class DataSource {
    constructor() {
        this.useSupabase = false
        this.checkSupabaseConfig()
    }

    // Check if Supabase is configured
    checkSupabaseConfig() {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        this.useSupabase = !!(supabaseUrl && supabaseKey && 
                             !supabaseUrl.includes('your_supabase_project_url') &&
                             !supabaseKey.includes('your_supabase_anon_key'))
        
        console.log(`Using ${this.useSupabase ? 'Supabase' : 'Mock'} data source`)
    }

    // Get all skills
    async getAllSkills() {
        if (this.useSupabase) {
            return await SupabaseAPI.getAllSkills()
        } else {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 100))
            return {
                success: true,
                data: mockSkills,
                total: mockSkills.length
            }
        }
    }

    // Search skills
    async searchSkills(query) {
        if (this.useSupabase) {
            return await SupabaseAPI.searchSkills(query)
        } else {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 200))
            const results = mockSkills.filter(skill => 
                skill.name.toLowerCase().includes(query.toLowerCase()) ||
                skill.description.toLowerCase().includes(query.toLowerCase()) ||
                skill.author.toLowerCase().includes(query.toLowerCase())
            )
            return {
                success: true,
                data: results,
                total: results.length
            }
        }
    }

    // Get categories
    async getCategories() {
        if (this.useSupabase) {
            return await SupabaseAPI.getCategories()
        } else {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 50))
            return {
                success: true,
                data: categories
            }
        }
    }

    // Install skill
    async installSkill(skillId, userId = null) {
        if (this.useSupabase && userId) {
            return await SupabaseAPI.installSkill(skillId, userId)
        } else {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 1000))
            const skill = mockSkills.find(s => s.id === skillId)
            if (skill) {
                skill.installed = true
                return {
                    success: true,
                    message: `Skill "${skill.name}" installed successfully`
                }
            }
            return {
                success: false,
                message: "Skill not found"
            }
        }
    }

    // Check if skill is installed
    async isSkillInstalled(skillId, userId = null) {
        if (this.useSupabase && userId) {
            return await SupabaseAPI.isSkillInstalled(skillId, userId)
        } else {
            // Mock implementation
            const skill = mockSkills.find(s => s.id === skillId)
            return skill ? skill.installed : false
        }
    }

    // Get featured skills
    async getFeaturedSkills() {
        if (this.useSupabase) {
            // For Supabase, we might want to mark certain skills as featured
            const result = await this.getAllSkills()
            if (result.success) {
                return {
                    success: true,
                    data: result.data.slice(0, 4) // First 4 as featured
                }
            }
            return result
        } else {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 50))
            const featured = mockSkills.filter(skill => featuredSkills.includes(skill.id))
            return {
                success: true,
                data: featured
            }
        }
    }
}

// Create singleton instance
export const dataSource = new DataSource()

// Export individual methods for convenience
export const {
    getAllSkills,
    searchSkills,
    getCategories,
    installSkill,
    isSkillInstalled,
    getFeaturedSkills
} = dataSource
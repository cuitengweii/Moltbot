// Supabase client configuration
import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// API functions for Supabase
export class SupabaseAPI {
    // Get all skills
    static async getAllSkills() {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select(`
                    *,
                    categories(name, icon, color),
                    users(username, display_name, avatar_url)
                `)
                .order('created_at', { ascending: false })
            
            if (error) throw error
            
            return {
                success: true,
                data: data || [],
                total: data?.length || 0
            }
        } catch (error) {
            console.error('Error fetching skills:', error)
            return {
                success: false,
                error: error.message,
                data: []
            }
        }
    }

    // Search skills
    static async searchSkills(query) {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select(`
                    *,
                    categories(name, icon, color),
                    users(username, display_name, avatar_url)
                `)
                .or(`name.ilike.%${query}%,description.ilike.%${query}%,categories.name.ilike.%${query}%`)
                .order('created_at', { ascending: false })
            
            if (error) throw error
            
            return {
                success: true,
                data: data || [],
                total: data?.length || 0
            }
        } catch (error) {
            console.error('Error searching skills:', error)
            return {
                success: false,
                error: error.message,
                data: []
            }
        }
    }

    // Get skill by ID
    static async getSkillById(id) {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select(`
                    *,
                    categories(name, icon, color),
                    users(username, display_name, avatar_url)
                `)
                .eq('id', id)
                .single()
            
            if (error) throw error
            
            return {
                success: true,
                data: data
            }
        } catch (error) {
            console.error('Error fetching skill:', error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    // Get categories
    static async getCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name')
            
            if (error) throw error
            
            return {
                success: true,
                data: data || []
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
            return {
                success: false,
                error: error.message,
                data: []
            }
        }
    }

    // Install skill (add to user's installed skills)
    static async installSkill(skillId, userId) {
        try {
            const { data, error } = await supabase
                .from('user_skills')
                .insert({
                    user_id: userId,
                    skill_id: skillId,
                    installed_at: new Date().toISOString()
                })
                .select()
                .single()
            
            if (error) throw error
            
            return {
                success: true,
                data: data,
                message: 'Skill installed successfully'
            }
        } catch (error) {
            console.error('Error installing skill:', error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    // Get user's installed skills
    static async getUserInstalledSkills(userId) {
        try {
            const { data, error } = await supabase
                .from('user_skills')
                .select(`
                    skills (*,
                        categories(name, icon, color),
                        users(username, display_name, avatar_url)
                    )
                `)
                .eq('user_id', userId)
            
            if (error) throw error
            
            return {
                success: true,
                data: data?.map(item => item.skills) || []
            }
        } catch (error) {
            console.error('Error fetching installed skills:', error)
            return {
                success: false,
                error: error.message,
                data: []
            }
        }
    }

    // Check if skill is installed by user
    static async isSkillInstalled(skillId, userId) {
        try {
            const { data, error } = await supabase
                .from('user_skills')
                .select('id')
                .eq('user_id', userId)
                .eq('skill_id', skillId)
                .single()
            
            // If no error and data exists, skill is installed
            return !error && data
        } catch (error) {
            return false
        }
    }
}
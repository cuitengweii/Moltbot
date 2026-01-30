// Simple API simulation for ClawdTM
import { mockSkills, categories } from './data.js';

export class SkillAPI {
    static async getAllSkills() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            success: true,
            data: mockSkills,
            total: mockSkills.length
        };
    }
    
    static async getSkillById(id) {
        await new Promise(resolve => setTimeout(resolve, 50));
        const skill = mockSkills.find(s => s.id === id);
        return {
            success: !!skill,
            data: skill
        };
    }
    
    static async searchSkills(query) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const results = mockSkills.filter(skill => 
            skill.name.toLowerCase().includes(query.toLowerCase()) ||
            skill.description.toLowerCase().includes(query.toLowerCase()) ||
            skill.author.toLowerCase().includes(query.toLowerCase())
        );
        return {
            success: true,
            data: results,
            total: results.length
        };
    }
    
    static async getCategories() {
        await new Promise(resolve => setTimeout(resolve, 50));
        return {
            success: true,
            data: categories
        };
    }
    
    static async installSkill(skillId) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const skill = mockSkills.find(s => s.id === skillId);
        if (skill) {
            skill.installed = true;
            return {
                success: true,
                message: `Skill "${skill.name}" installed successfully`
            };
        }
        return {
            success: false,
            message: "Skill not found"
        };
    }
    
    static async uninstallSkill(skillId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const skill = mockSkills.find(s => s.id === skillId);
        if (skill) {
            skill.installed = false;
            return {
                success: true,
                message: `Skill "${skill.name}" uninstalled successfully`
            };
        }
        return {
            success: false,
            message: "Skill not found"
        };
    }
}
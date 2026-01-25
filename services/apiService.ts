import { QuizResult, Difficulty, Language } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

class APIService {
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        // Don't set Content-Type for FormData - let browser set it with boundary
        const isFormData = options.body instanceof FormData;

        const headers: Record<string, string> = {
            ...(!isFormData && { 'Content-Type': 'application/json' }),
            ...(this.token && { Authorization: `Token ${this.token}` }),
            ...(options.headers as Record<string, string>),
        };

        console.log('API Request:', {
            url: `${API_BASE_URL}${endpoint}`,
            method: options.method || 'GET',
            hasToken: !!this.token,
            isFormData
        });

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            console.log('API Response:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                // If unauthorized, clear local token
                if (response.status === 401) {
                    this.token = null;
                    localStorage.removeItem('authToken');
                }

                let errorMessage = `API Error: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    console.error('API Error Data:', errorData);
                    if (errorData.detail) errorMessage = errorData.detail;
                    else if (errorData.error) errorMessage = errorData.error;
                    else if (errorData.message) errorMessage = errorData.message;
                    else if (typeof errorData === 'string') errorMessage = errorData;
                    else errorMessage = JSON.stringify(errorData);
                } catch (e) {
                    console.error('Failed to parse error response:', e);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('API Success:', data);
            return data;
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    // Authentication
    async register(data: { username: string; email: string; password: string; first_name?: string; admin_code?: string }) {
        this.token = null;
        localStorage.removeItem('authToken');

        const response = await this.request('/auth/register/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        this.token = response.token;
        localStorage.setItem('authToken', response.token);
        return response;
    }

    async login(email: string, password: string) {
        this.token = null;
        localStorage.removeItem('authToken');

        const response = await this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.token = response.token;
        localStorage.setItem('authToken', response.token);
        return response;
    }

    async logout() {
        if (this.token) {
            try {
                await this.request('/auth/logout/', { method: 'POST' });
            } catch (e) {
                console.warn('Logout failed on server', e);
            }
        }
        this.token = null;
        localStorage.removeItem('authToken');
    }

    async getCurrentUser() {
        if (!this.token) return null;
        return this.request('/auth/me/');
    }

    async updateProfile(formData: FormData) {
        return this.request('/auth/update-profile/', {
            method: 'PATCH',
            body: formData
        });
    }

    // Quiz Operations
    async generateQuiz(data: { topic: string; difficulty: Difficulty; count: number; language: Language }) {
        return this.request('/quiz/generate/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async submitQuiz(quizId: number | string, answers: Array<{ question_id: number; selected_option: number }>) {
        return this.request('/quiz/submit/', {
            method: 'POST',
            body: JSON.stringify({ quiz_id: quizId, answers }),
        });
    }

    async getMyQuizzes() {
        return this.request('/quizzes/my_quizzes/');
    }

    async getQuizHistory() {
        return this.request('/attempts/my_history/');
    }

    async getQuizStats() {
        return this.request('/attempts/stats/');
    }

    // Admin
    async getAdminDashboard() {
        return this.request('/admin/dashboard/');
    }
}

export const apiService = new APIService();

// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/agents';

class ApiService {
  async generateIdeation(prompt) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ideation`, { prompt });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateCode(ideation, specificRequest = '') {
    try {
      const response = await axios.post(`${API_BASE_URL}/code`, {
        ideation,
        specificRequest
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCode(existingCode, updateRequest) {
    try {
      const response = await axios.post(`${API_BASE_URL}/code/update`, {
        existingCode,
        updateRequest
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async generateDocumentation(codeFiles, ideation) {
    try {
      const response = await axios.post(`${API_BASE_URL}/documentation`, {
        codeFiles,
        ideation
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateDocumentation(existingDocs, codeChanges) {
    try {
      const response = await axios.post(`${API_BASE_URL}/documentation/update`, {
        existingDocs,
        codeChanges
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      return new Error('No response from server. Please check if the backend is running.');
    } else {
      return new Error(error.message || 'An error occurred');
    }
  }
}

export default new ApiService();
import { toast } from 'react-toastify'

class TestResultService {
  constructor() {
    this.apperClient = null;
    this.isAdminMode = import.meta.env.VITE_ADMIN_MODE === 'true';
    if (this.isAdminMode) {
      this.initClient();
    }
  }

  initClient() {
    if (!this.isAdminMode) {
      throw new Error('Database access restricted to admin use only');
    }
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  checkAdminAccess() {
    if (!this.isAdminMode) {
      throw new Error('Database access restricted to admin use only');
    }
  }
async getAll() {
    this.checkAdminAccess();
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "marker_id" } },
          { field: { Name: "value" } },
          { field: { Name: "unit" } },
          { field: { Name: "status" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('test_result', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching test results:', error);
      toast.error('Failed to load test results');
      return [];
    }
  }

async getById(id) {
    this.checkAdminAccess();
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "marker_id" } },
          { field: { Name: "value" } },
          { field: { Name: "unit" } },
          { field: { Name: "status" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('test_result', parseInt(id, 10), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching test result with ID ${id}:`, error);
      return null;
    }
  }

async create(item) {
    this.checkAdminAccess();
    try {
      const params = {
        records: [{
          Name: item.Name || `Test Result ${Date.now()}`,
          marker_id: parseInt(item.marker_id || item.markerId, 10),
          value: parseFloat(item.value),
          unit: item.unit,
          status: item.status
        }]
      };
      
      const response = await this.apperClient.createRecord('test_result', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating test result:', error);
      toast.error('Failed to create test result');
      return null;
    }
  }

async update(id, updates) {
    this.checkAdminAccess();
    try {
      const params = {
        records: [{
          Id: parseInt(id, 10),
          Name: updates.Name,
          marker_id: updates.marker_id ? parseInt(updates.marker_id, 10) : undefined,
          value: updates.value ? parseFloat(updates.value) : undefined,
          unit: updates.unit,
          status: updates.status
        }]
      };
      
      const response = await this.apperClient.updateRecord('test_result', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating test result:', error);
      toast.error('Failed to update test result');
      return null;
    }
  }

async delete(id) {
    this.checkAdminAccess();
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await this.apperClient.deleteRecord('test_result', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return failedDeletions.length === 0;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting test result:', error);
      toast.error('Failed to delete test result');
      return false;
    }
  }

async saveTestResults(results) {
    // Keep session storage for current workflow
    sessionStorage.setItem('testoscope_current_results', JSON.stringify(results));
    
    // Only persist to database if admin mode is enabled
    if (this.isAdminMode) {
      try {
        for (const [markerId, result] of Object.entries(results)) {
          await this.create({
            Name: `Test Result for Marker ${markerId}`,
            marker_id: markerId,
            value: result.value,
            unit: result.unit,
            status: result.status
          });
        }
      } catch (error) {
        console.error('Error persisting test results to database:', error);
      }
    }
    return results;
  }

  async getCurrentResults() {
    const stored = sessionStorage.getItem('testoscope_current_results');
    return stored ? JSON.parse(stored) : {};
  }

  async clearCurrentResults() {
    sessionStorage.removeItem('testoscope_current_results');
    return true;
  }
}

export default new TestResultService()
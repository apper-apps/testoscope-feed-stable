import { toast } from 'react-toastify'

class BiomarkerService {
  constructor() {
    this.apperClient = null;
    this.initClient();
  }

  initClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "units" } },
          { field: { Name: "optimal_range" } },
          { field: { Name: "age_adjustment" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('biomarker', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(item => this.formatBiomarkerData(item)) || [];
    } catch (error) {
      console.error('Error fetching biomarkers:', error);
      toast.error('Failed to load biomarkers');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "units" } },
          { field: { Name: "optimal_range" } },
          { field: { Name: "age_adjustment" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('biomarker', parseInt(id, 10), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return this.formatBiomarkerData(response.data);
    } catch (error) {
      console.error(`Error fetching biomarker with ID ${id}:`, error);
      return null;
    }
  }

  async getByCategory(category) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "units" } },
          { field: { Name: "optimal_range" } },
          { field: { Name: "age_adjustment" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('biomarker', params);
      
      if (!response.success) {
        return [];
      }
      
      return response.data?.map(item => this.formatBiomarkerData(item)) || [];
    } catch (error) {
      console.error('Error fetching biomarkers by category:', error);
      return [];
    }
  }

formatBiomarkerData(item) {
    try {
      // Safe JSON parsing helper
      const safeJsonParse = (value, fallback) => {
        if (!value) return fallback;
        if (typeof value === 'object') return value;
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch {
            return fallback;
          }
        }
        return fallback;
      };

      return {
        Id: item.Id || item.id,
        name: item.Name || item.name || '',
        category: item.category || '',
        units: safeJsonParse(item.units, []),
        optimalRange: safeJsonParse(item.optimal_range || item.optimalRange, {}),
        ageAdjustment: safeJsonParse(item.age_adjustment || item.ageAdjustment, null),
        description: item.description || ''
      };
    } catch (error) {
      console.error('Error formatting biomarker data:', error, 'Item:', item);
      // Return a safe fallback object with expected structure
      return {
        Id: item.Id || item.id || 0,
        name: item.Name || item.name || 'Unknown',
        category: item.category || 'Unknown',
        units: [],
        optimalRange: {},
        ageAdjustment: null,
        description: item.description || ''
      };
    }
  }

  async calculateStatus(markerId, value, age = 35) {
    const biomarker = await this.getById(markerId);
    if (!biomarker) return 'unknown';

    const ageAdjustedRanges = this.getAgeAdjustedRanges(biomarker, age);

    if (value < ageAdjustedRanges.low) return 'low';
    if (value < ageAdjustedRanges.suboptimalLow) return 'suboptimal-low';
    if (value <= ageAdjustedRanges.optimal) return 'optimal';
    if (value <= ageAdjustedRanges.suboptimalHigh) return 'suboptimal-high';
    return 'high';
  }

  getAgeAdjustedRanges(biomarker, age) {
    const baseRanges = biomarker.optimalRange;
    const ageAdjustment = biomarker.ageAdjustment || { rate: 0, startAge: 30 };
    
    if (age <= ageAdjustment.startAge) {
      return baseRanges;
    }

    const yearsAfterStart = age - ageAdjustment.startAge;
    const adjustmentFactor = 1 + (ageAdjustment.rate * yearsAfterStart / 100);

    return {
      ...baseRanges,
      low: baseRanges.low * adjustmentFactor,
      suboptimalLow: baseRanges.suboptimalLow * adjustmentFactor,
      optimal: baseRanges.optimal * adjustmentFactor,
      suboptimalHigh: baseRanges.suboptimalHigh * adjustmentFactor,
      high: baseRanges.high * adjustmentFactor
    };
  }
}

export default new BiomarkerService()
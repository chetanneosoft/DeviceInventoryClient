export const strings = {
  screens: {
    getObjectsById: {
      title: "Get Objects by ID",
      placeholder: "Enter comma-separated IDs (e.g., 3,5,10)",
      fetchButton: "Fetch Objects",
      resultsTitle: "Fetched Objects:",
      emptyMessage: "No objects fetched yet. Enter IDs and click Fetch Objects.",
      offlineBanner: "Offline mode. Fetching is disabled; showing last successful results.",
      errors: {
        emptyIds: "Please enter at least one object ID.",
        invalidIds: "Invalid input. Please enter valid, comma-separated IDs (e.g., 3, 5, 10) or offline IDs."
      }
    },
    addObject: {
      title: "Please Add New Object",
      offlineBanner: "You are currently offline. Data will be saved locally."
    }
  },
  form: {
    placeholders: {
      name: "Name",
      year: "Year (e.g., 2024)",
      price: "Price (e.g., 1200)",
      cpuModel: "CPU Model",
      hardDiskSize: "Hard Disk Size"
    },
    submitButton: "Submit Object",
    validation: {
      formDataRequired: "Form data is required.",
      nameRequired: "Object name is required.",
      detailsRequired: "Object details are required.",
      yearRequired: "Year is required.",
      yearInvalid: "A valid year (e.g., 2024) is required.",
      priceRequired: "Price is required.",
      priceInvalid: "A valid price (greater than 0) is required.",
      cpuModelRequired: "CPU Model is required.",
      hardDiskSizeRequired: "Hard Disk Size is required."
    }
  },
  navigation: {
    addObject: "Add Object",
    deviceInventory: "Device Inventory"
  },
  messages: {
    success: {
      objectCreated: "Object successfully created. ID: {id}",
      objectsFetched: "Objects fetched successfully.",
      syncSuccess: "{count} object(s) synced successfully.",
      syncPartial: "{synced} synced, {failed} failed. {remaining} remaining in queue.",
      syncFailed: "Failed to sync {failed} object(s). {remaining} remaining in queue."
    },
    error: {
      offlineDisplay: "Device is offline. Displaying last fetched results.",
      dataSavedLocally: "Data saved locally (ID: {id}). Sync when online.",
      dataSavedLocallyMessage: "Data saved locally. Will sync when online.",
      failedToSave: "Failed to save data locally.",
      deviceOffline: "Device is still offline.",
      syncFailed: "Failed to sync offline queue.",
      noObjectsFound: "No objects found."
    }
  },
  objectDetails: {
    id: "ID: {id}",
    invalidData: "Invalid object data",
    noDataAvailable: "No additional data available",
    notAvailable: "N/A"
  },
  common: {
    addButton: "+"
  }
} as const;

export const formatString = (template: string, replacements: Record<string, string | number>): string => {
  let result = template;
  Object.keys(replacements).forEach(key => {
    result = result.replace(`{${key}}`, String(replacements[key]));
  });
  return result;
};

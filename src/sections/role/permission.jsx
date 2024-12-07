import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MonitorIcon from '@mui/icons-material/Monitor';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FormControlLabel from '@mui/material/FormControlLabel';

const PermissionsManager = ({ resources, permissions }) => {
  const [activeTab, setActiveTab] = useState("api");
  const [expandedCards, setExpandedCards] = useState({});
  const [selectAll, setSelectAll] = useState({
    api: false,
    client: false,
  });
  const [resourceSelections, setResourceSelections] = useState({});
  const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);

  useEffect(() => {
    const selections = {};
    resources.forEach((resource) => {
      selections[resource._id] = {
        identifiers: new Set(),
      };

      // Initialize API permissions
      if (resource.type === 'api') {
        if (permissions.api?.includes(resource.identifier)) {
          selections[resource._id].identifiers.add(resource.identifier);
        }
      }

      // Initialize Client permissions
      if (resource.type === 'client') {
        if (permissions.client?.includes(resource.identifier)) {
          selections[resource._id].identifiers.add(resource.identifier);
        }
      }
    });
    setResourceSelections(selections);
  }, [resources, permissions]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleExpanded = (resourceId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [resourceId]: !prev[resourceId],
    }));
  };

  const handleSelectAllAPI = (checked) => {
    setSelectAll((prev) => ({ ...prev, api: checked }));
    const newSelections = { ...resourceSelections };

    resources
      .filter((resource) => resource.type === 'api')
      .forEach((resource) => {
        if (checked) {
          newSelections[resource._id].identifiers.add(resource.identifier);
        } else {
          newSelections[resource._id].identifiers.delete(resource.identifier);
        }
      });

    setResourceSelections(newSelections);
    setShowUnsavedAlert(true);
  };

  const handleMethodToggle = (resourceId, identifier) => {
    const newSelections = { ...resourceSelections };
    if (newSelections[resourceId].identifiers.has(identifier)) {
      newSelections[resourceId].identifiers.delete(identifier);
    } else {
      newSelections[resourceId].identifiers.add(identifier);
    }
    setResourceSelections(newSelections);
    setShowUnsavedAlert(true);
  };

  const handleSelectAllClient = (checked) => {
    setSelectAll((prev) => ({ ...prev, client: checked }));
    const newSelections = { ...resourceSelections };

    resources
      .filter((resource) => resource.type === 'client')
      .forEach((resource) => {
        if (checked) {
          newSelections[resource._id].identifiers.add(resource.identifier);
        } else {
          newSelections[resource._id].identifiers.delete(resource.identifier);
        }
      });

    setResourceSelections(newSelections);
    setShowUnsavedAlert(true);
  };

  const groupResourcesByModule = (data) => data.reduce((acc, resource) => {
    if (!acc[resource.module]) {
      acc[resource.module] = [];
    }

    // Add the resource to its module array
    acc[resource.module].push(resource);

    return acc;
  }, {});

  const groupedResources = groupResourcesByModule(resources);

  // Render API Permissions Section
  const renderAPIPermissions = () => (
    <Box sx={{ mt: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={selectAll.api}
            onChange={(e) => handleSelectAllAPI(e.target.checked)}
          />
        }
        label="Select All API Permissions"
      />

      {Object.keys(groupedResources).map((moduleName) => {
        const resourcesByModule = groupedResources[moduleName];
        return (
          <Box key={moduleName}>
            <Typography variant="h6">{moduleName}</Typography>
            {
              resourcesByModule
                .filter((resource) => resource.type === 'api')
                .map((resource) => {
                  const isExpanded = expandedCards[resource._id];
                  const isChecked = resourceSelections[resource._id]?.identifiers?.has(resource.identifier);

                  return (
                    <Paper key={resource._id} sx={{ mt: 1, p: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            size="small"
                            onClick={() => toggleExpanded(resource._id)}
                          >
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            {resource.label}
                          </Typography>
                        </Box>
                        <FormControlLabel
                          key={resource.identifier}
                          control={
                            <Switch
                              checked={isChecked}
                              onChange={() => handleMethodToggle(resource._id, resource.identifier)}
                            />
                          }
                        />
                      </Box>

                      <Collapse in={isExpanded}>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            {resource.identifier}
                          </Typography>

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "repeat(4, 1fr)",
                              gap: 2,
                              mt: 2,
                            }}
                          >
                            <FormControlLabel
                              key={resource.identifier}
                              control={
                                <Switch
                                  checked={isChecked}
                                  onChange={() => handleMethodToggle(resource._id, resource.identifier)}
                                />
                              }
                              label={resource.identifier}
                            />
                          </Box>
                        </Box>
                      </Collapse>
                    </Paper>
                  );
                })}
          </Box>

        );
      })}
    </Box>
  );

  // Render Client Permissions Section
  const renderClientPermissions = () => (
    <Box sx={{ mt: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={selectAll.client}
            onChange={(e) => handleSelectAllClient(e.target.checked)}
          />
        }
        label="Select All UI Permissions"
      />

      {Object.keys(groupedResources).map((moduleName) => {
        const resourcesByModule = groupedResources[moduleName];
        return (
          <Box key={moduleName}>
            <Typography variant="h6">{moduleName}</Typography>
            {resourcesByModule
              .filter((resource) => resource.type === 'client')
              .map((resource) => {
                const isExpanded = expandedCards[resource._id];
                const isChecked = resourceSelections[resource._id]?.identifiers?.has(resource.identifier);

                return (
                  <Paper key={resource._id} sx={{ mt: 2, p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleExpanded(resource._id)}
                        >
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        <Typography variant="h6">
                          {resource.label}
                        </Typography>
                      </Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isChecked}
                            onChange={() => handleMethodToggle(resource._id, resource.identifier)}
                          />
                        }
                      />
                    </Box>

                    <Collapse in={isExpanded}>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          {resource.identifier}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {resource.description}
                        </Typography>
                      </Box>
                    </Collapse>
                  </Paper>
                );
              })}
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Permissions Management
          </Typography>
        </Box>
      </Box>

      {showUnsavedAlert && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          onClose={() => setShowUnsavedAlert(false)}
        >
          You have unsaved changes. Don&apos;t forget to save before leaving!
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            icon={<LockIcon />}
            iconPosition="start"
            label="API Permissions"
            value="api"
          />
          <Tab
            icon={<MonitorIcon />}
            iconPosition="start"
            label="UI Permissions"
            value="client"
          />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {activeTab === "api"
            ? renderAPIPermissions()
            : renderClientPermissions()}
        </Box>
      </Paper>
    </Box>
  );
};

PermissionsManager.propTypes = {
  resources: PropTypes.array.isRequired,
  permissions: PropTypes.object.isRequired,
};

export default PermissionsManager;

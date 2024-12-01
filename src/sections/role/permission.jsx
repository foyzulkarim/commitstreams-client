import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ShieldIcon from '@mui/icons-material/Shield';
import MonitorIcon from '@mui/icons-material/Monitor';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FormControlLabel from '@mui/material/FormControlLabel';

const PermissionsManager = ({ role, resources, permissions }) => {
  const [activeTab, setActiveTab] = useState("api");
  const [expandedCards, setExpandedCards] = useState({});
  const [selectAll, setSelectAll] = useState({
    api: false,
    client: false,
  });
  const [resourceSelections, setResourceSelections] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);

  // Initialize resource selections
  useEffect(() => {
    const selections = {};
    resources.forEach((resource) => {
      const permission = permissions.find(
        (p) => p.resource_id === resource._id
      );
      if (resource.api) {
        selections[resource._id] = {
          methods: new Set(permission?.api_access?.methods || []),
        };
      }
      if (resource.client) {
        selections[resource._id] = {
          actions:
            permission?.client_access?.actions?.reduce((acc, action) => {
              acc[action.name] = {
                show: action.visibility?.show || false,
                enabled: action.visibility?.enabled || false,
              };
              return acc;
            }, {}) || {},
        };
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
      .filter((resource) => resource.api && !resource.is_system_managed)
      .forEach((resource) => {
        newSelections[resource._id] = {
          ...newSelections[resource._id],
          methods: new Set(checked ? resource.api.methods : []),
        };
      });

    setResourceSelections(newSelections);
    setHasChanges(true);
  };

  const handleMethodToggle = (resourceId, method) => {
    const newSelections = { ...resourceSelections };
    if (newSelections[resourceId].methods.has(method)) {
      newSelections[resourceId].methods.delete(method);
    } else {
      newSelections[resourceId].methods.add(method);
    }
    setResourceSelections(newSelections);
    setHasChanges(true);
  };

  const handleSelectAllClient = (checked) => {
    setSelectAll((prev) => ({ ...prev, client: checked }));
    const newSelections = { ...resourceSelections };

    resources
      .filter((resource) => resource.client && !resource.is_system_managed)
      .forEach((resource) => {
        newSelections[resource._id] = {
          ...newSelections[resource._id],
          actions: resource.client.actions.reduce((acc, action) => {
            acc[action.name] = {
              show: checked,
              enabled: checked,
            };
            return acc;
          }, {}),
        };
      });

    setResourceSelections(newSelections);
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    setHasChanges(false);
    setShowUnsavedAlert(false);
  };

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

      {resources
        .filter((resource) => resource.api)
        .map((resource) => {
          const permission = permissions.find(
            (p) => p.resource_id === resource._id
          );
          const isExpanded = expandedCards[resource._id];

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
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {resource.name}
                    {resource.is_system_managed && (
                      <Chip
                        label="System"
                        size="small"
                        sx={{ ml: 1 }}
                        color="default"
                      />
                    )}
                  </Typography>
                </Box>
                <Tooltip title="View API details">
                  <IconButton size="small">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Collapse in={isExpanded}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    {resource.api.endpoint}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    {resource.api.methods.map((method) => (
                      <FormControlLabel
                        key={method}
                        control={
                          <Switch
                            checked={resourceSelections[
                              resource._id
                            ]?.methods?.has(method)}
                            onChange={() =>
                              handleMethodToggle(resource._id, method)
                            }
                            disabled={resource.is_system_managed}
                          />
                        }
                        label={method}
                      />
                    ))}
                  </Box>

                  {permission?.api_access?.custom_rate_limit && (
                    <Box
                      sx={{ mt: 2, p: 1, bgcolor: "grey.100", borderRadius: 1 }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <SettingsIcon sx={{ fontSize: "small", mr: 1 }} />
                        <Typography variant="body2">
                          Rate Limit:{" "}
                          {permission.api_access.custom_rate_limit.requests}
                          requests /{" "}
                          {permission.api_access.custom_rate_limit.duration}s
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Collapse>
            </Paper>
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

      {resources
        .filter((resource) => resource.client)
        .map((resource) => {
          const isExpanded = expandedCards[resource._id];

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
                  <ShieldIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {resource.name}
                    {resource.is_system_managed && (
                      <Chip
                        label="System"
                        size="small"
                        sx={{ ml: 1 }}
                        color="default"
                      />
                    )}
                  </Typography>
                </Box>
              </Box>

              <Collapse in={isExpanded}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    {resource.client.component}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    {resource.client.actions.map((action) => (
                      <Paper key={action.name} sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          {action.label}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={
                                  resourceSelections[resource._id]?.actions?.[
                                    action.name
                                  ]?.show
                                }
                                onChange={() => {
                                  const newSelections = {
                                    ...resourceSelections,
                                  };
                                  newSelections[resource._id].actions[
                                    action.name
                                  ].show =
                                    !newSelections[resource._id].actions[
                                      action.name
                                    ].show;
                                  setResourceSelections(newSelections);
                                  setHasChanges(true);
                                }}
                                disabled={resource.is_system_managed}
                              />
                            }
                            label="Show"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={
                                  resourceSelections[resource._id]?.actions?.[
                                    action.name
                                  ]?.enabled
                                }
                                onChange={() => {
                                  const newSelections = {
                                    ...resourceSelections,
                                  };
                                  newSelections[resource._id].actions[
                                    action.name
                                  ].enabled =
                                    !newSelections[resource._id].actions[
                                      action.name
                                    ].enabled;
                                  setResourceSelections(newSelections);
                                  setHasChanges(true);
                                }}
                                disabled={
                                  resource.is_system_managed ||
                                  !resourceSelections[resource._id]?.actions?.[
                                    action.name
                                  ]?.show
                                }
                              />
                            }
                            label="Enable"
                          />
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              </Collapse>
            </Paper>
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
          <Typography variant="h4" sx={{ mb: 1 }}>
            Permissions Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Role: {role.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
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
  role: PropTypes.object.isRequired,
  resources: PropTypes.array.isRequired,
  permissions: PropTypes.array.isRequired,
};

export default PermissionsManager;

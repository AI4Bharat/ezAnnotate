package dataturks;

import bonsai.Constants;
import bonsai.Utils.CommonUtils;
import bonsai.config.AppConfig;
import bonsai.config.DBBasedConfigs;
import bonsai.dropwizard.dao.d.DHits;
import bonsai.dropwizard.dao.d.DHitsResult;
import bonsai.dropwizard.dao.d.DProjects;
import bonsai.dropwizard.resources.DataturksEndpoint.DummyResponse;

import com.fasterxml.jackson.core.io.JsonStringEncoder;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import dataturks.response.UploadResponse;
//import netscape.javascript.JSObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.*;

public class DataDownloadHandler {
    private static JsonStringEncoder e = JsonStringEncoder.getInstance();

    private static final Logger LOG = LoggerFactory.getLogger(DataDownloadHandler.class);

    static Map<Long, DHitsResult> getHitId2ResultMap(DReqObj reqObj, DProjects project) {
        List<DHitsResult> results = AppConfig.getInstance().getdHitsResultDAO().findAllByProjectIdInternal(project.getId());
        Map<Long, DHitsResult> hitsResultMap = new HashMap<>();
        final boolean syncMode = (reqObj.getReqMap() != null && reqObj.getReqMap().containsKey("isDownSync"));

        for (DHitsResult result : results) {
            if (syncMode) { 
                if (result.getSentViaAPI()) continue; // Ignore results already sent
                result.setSentViaAPI(true); // Mark this HitsResult as sent via API
                AppConfig.getInstance().getdHitsResultDAO().saveOrUpdateInternal(result);
            }
            hitsResultMap.put(result.getHitId(), result);
        }

        return hitsResultMap;
    }

    public static DummyResponse handleDownSyncReset(DReqObj reqObj, DProjects project, long timestamp_since) {
        List<DHitsResult> results = AppConfig.getInstance().getdHitsResultDAO().findAllByProjectIdInternal(project.getId());
        java.util.Date timestamp = new java.util.Date(timestamp_since*1000L);

        for (DHitsResult result : results) {
            if (result.getSentViaAPI() && result.getUpdated_timestamp().after(timestamp)) {
                result.setSentViaAPI(false);
                AppConfig.getInstance().getdHitsResultDAO().saveOrUpdateInternal(result);
            }
        }
        return DummyResponse.getOk();
    }

    public static String handlePOSTagging(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType,  DTypes.File_Download_Format format) {
        return handlePOSTypes(reqObj, project, downloadType, format);
    }

    public static String handlePOSTaggingGeneric(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType,  DTypes.File_Download_Format format) {
        return handlePOSTypes(reqObj, project, downloadType, format);
    }

    public static String handleTextClassification(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleJsonDownload(reqObj, project, downloadType);
    }

    public static String handleTextPairClassification(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleJsonDownload(reqObj, project, downloadType);
    }

    public static String handleTextSummarization(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleForTextTypes(reqObj, project, downloadType);
    }

    public static String handleTextTranslation(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleJsonDownload(reqObj, project, downloadType);
    }

    public static String handleTextModeration(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleForTextTypes(reqObj, project, downloadType);
    }

    public static String handleDocumentAnnotation(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType,  DTypes.File_Download_Format format) {
        return handlePOSTypes(reqObj, project, downloadType, format);
    }

    public static String handleImageClassification(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleForImageTypes(reqObj, project, downloadType);
    }

    public static String handleImageBoundingBox(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleForImageTypes(reqObj, project, downloadType);
    }

    public static String handleImagePolygonBoundingBox(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleForImageTypes(reqObj, project, downloadType);
    }

    private static String handleForImageTypes(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleJsonDownload(reqObj, project, downloadType);
    }

    public static String handleVideoClassification(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleForImageTypes(reqObj, project, downloadType);
    }

    public static String handleVideoBoundingBox(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleForImageTypes(reqObj, project, downloadType);
    }

    private static String handleForVideoTypes(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        return handleJsonDownload(reqObj, project, downloadType);
    }



    private static String handlePOSTypes(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType, DTypes.File_Download_Format format) {
        if (format == DTypes.File_Download_Format.STANFORD_NER) {

            return DataDownloadHelper.handleStanfordDownload(reqObj, project);
        }
        else {
            return handleJsonDownload(reqObj, project, downloadType);
        }
    }

    private static String handleForTextTypes(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {

        List<DHits> hits = AppConfig.getInstance().getdHitsDAO().findAllByProjectIdInternal(project.getId());
        Map<Long, DHitsResult> hitsResultMap = getHitId2ResultMap(reqObj, project);

        List<String> lines = new ArrayList<>();
        lines.add("input"+ DConstants.TEXT_INPUT_RESULT_SEPARATOR  + "result");
        //get all hit/hit id pairs.
        for (DHits hit : hits) {
            if (DConstants.HIT_STATUS_DONE.equalsIgnoreCase(hit.getStatus()) && hitsResultMap.containsKey(hit.getId())) {
                lines.add(hit.getData() + DConstants.TEXT_INPUT_RESULT_SEPARATOR  + hitsResultMap.get(hit.getId()).getResult());
            }

            else if (downloadType == DTypes.File_Download_Type.ALL) {
                //in case of skipped, we might have some result.
                String resultData = hitsResultMap.containsKey(hit.getId())? hitsResultMap.get(hit.getId()).getResult(): "";
                lines.add(hit.getData() + DConstants.TEXT_INPUT_RESULT_SEPARATOR  + resultData);
            }
        }

        String filePath = DataDownloadHelper.outputToTempFile(lines, project.getName() + ".tsv");
        return filePath;

    }

    private static String handleJsonDownload(DReqObj reqObj, DProjects project, DTypes.File_Download_Type downloadType) {
        List<DHits> hits = AppConfig.getInstance().getdHitsDAO().findAllByProjectIdInternal(project.getId());
        Map<Long, DHitsResult> hitsResultMap = getHitId2ResultMap(reqObj, project);
        List<String> lines = new ArrayList<>();

        boolean isPaidProject = Validations.isPaidPlanProject(project);

        //get all hit/hit id pairs.
        for (DHits hit : hits) {
            if (DConstants.HIT_STATUS_DONE.equalsIgnoreCase(hit.getStatus())  && hitsResultMap.containsKey(hit.getId())) {
                lines.add(formatAsJson(project, hit, hitsResultMap.get(hit.getId()), isPaidProject));
            }
            else if (downloadType == DTypes.File_Download_Type.ALL) {
                //in case of skipped, we might have some result.
                DHitsResult result = hitsResultMap.containsKey(hit.getId())? hitsResultMap.get(hit.getId()): null;
                lines.add(formatAsJson(project, hit, result, isPaidProject));
            }
        }
        String filePath = DataDownloadHelper.outputToTempFile(lines, project.getName() + ".json");
        return filePath;
    }

    private static String formatAsJson(DProjects project, DHits hit, DHitsResult result, boolean isPaidPlanProject) {
        String resultJson = result != null ? result.getResult() : "";
        //for image classification, old hit results may not have a wellformed json in result
        // fix that.
        switch(project.getTaskType()) {
            case IMAGE_CLASSIFICATION:
            case TEXT_CLASSIFICATION:
            case SENTENCE_PAIR_CLASSIFIER:
                resultJson = DataDownloadHelper.fixImageClassificationResultJson(resultJson);
                break;
            case POS_TAGGING:
                resultJson = DataDownloadHelper.convertPoSToJson(resultJson);
                break;
        }
        
        return DataDownloadHelper.formatAsJson(hit, result, resultJson, isPaidPlanProject);
    }




}

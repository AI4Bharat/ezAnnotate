package bonsai.dropwizard.dao.d;

import dataturks.DConstants;
import dataturks.DTypes;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.context.internal.ManagedSessionContext;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.sql.Timestamp;

public class DHitsDAO extends AbstractDAO<DHits> implements IDDao<DHits>{

    /**
     * Constructor.
     *
     * @param sessionFactory Hibernate session factory.
     */
    SessionFactory sessionFactory ;
    public DHitsDAO(SessionFactory sessionFactory) {
        super(sessionFactory);
        this.sessionFactory = sessionFactory;
    }

    public List<DHits> findAll() {
        return list(namedQuery("bonsai.dropwizard.dao.d.DHits.findAll"));
    }

    //Called from within the app and not via a hibernate resources hence does not have session binding.
    public List<DHits> findAllInternal() {
        Session session = sessionFactory.openSession();
        try {
            ManagedSessionContext.bind(session);
            Transaction transaction = session.beginTransaction();
            try {
                List<DHits> list= findAll();
                transaction.commit();
                return list;
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }
    }

    public String create(DHits entry) {
        return persist(entry).getId() + "";
    }

    public String createInternal(DHits entry) {
        Session session = sessionFactory.openSession();
        try {
            ManagedSessionContext.bind(session);
            Transaction transaction = session.beginTransaction();
            try {
                String  id = create(entry);
                transaction.commit();
                return id;
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }
    }


    public DHits findById(long id) {

        List<DHits> list =  list(
                namedQuery("bonsai.dropwizard.dao.d.DHits.findById")
                        .setParameter("id", id)
        );

        if (list != null && list.size() > 0) {
            return list.get(0);
        }
        return null;
    }

    @Deprecated
    public DHits findByIdInternal(String id) {
        return findByIdInternal(Long.parseLong(id));
    }

    public DHits findByIdInternal(long id) {
        Session session = sessionFactory.openSession();
        try {
            ManagedSessionContext.bind(session);
            Transaction transaction = session.beginTransaction();
            try {
                DHits DHits = findById(id);
                transaction.commit();
                return DHits;
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }

    }

    public boolean deleteInternal(DHits DHits) {
        Session session = sessionFactory.openSession();
        try {
            ManagedSessionContext.bind(session);
            Transaction transaction = session.beginTransaction();
            try {
                session.delete(DHits);
                transaction.commit();
                return true;
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }
    }

    public boolean saveOrUpdateInternal(DHits DHits) {
        Session session = sessionFactory.openSession();
        try {
            ManagedSessionContext.bind(session);
            Transaction transaction = session.beginTransaction();
            try {
                session.saveOrUpdate(DHits);
                transaction.commit();
                return true;
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }
    }

    private List<DHits> findAllByProjectId(String projectId) {

        List<DHits> list =  list(
                namedQuery("bonsai.dropwizard.dao.d.DHits.findByProjectId")
                        .setParameter("projectId", projectId)
        );

        return list;
    }

    public List<DHits> findAllByProjectIdInternal(String projectId) {
        Session session = sessionFactory.openSession();
        try {
            ManagedSessionContext.bind(session);
            Transaction transaction = session.beginTransaction();
            try {
                List<DHits> results = findAllByProjectId(projectId);
                transaction.commit();
                return results;
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }

    }

    private long getCountForProjectForStatus(String projectId, String status) {
        Session session = sessionFactory.openSession();
        try {
            ManagedSessionContext.bind(session);
            org.hibernate.Transaction transaction = session.beginTransaction();
            try {
                Query query = null;
                if (status == null) {
                     query = session.createQuery("select count(*) from DHits e where e.projectId=:projectId");
                }
                else {
                     query = session.createQuery("select count(*) from DHits e where e.projectId=:projectId AND e.status=:status");
                     query.setParameter("status", status);
                }

                query.setParameter("projectId", projectId);
                Long count = (Long)query.uniqueResult();
                transaction.commit();
                return count != null? count : 0;
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }
    }

    private long getCountForProjectForEvaluation(String projectId, DTypes.HIT_Evaluation_Type evaluation) {
        Session session = sessionFactory.openSession();
        try {
            ManagedSessionContext.bind(session);
            org.hibernate.Transaction transaction = session.beginTransaction();
            try {
                Query query = null;
                query = session.createQuery("select count(*) from DHits e where e.projectId=:projectId AND e.evaluation=:evaluation" +
                        " AND (e.status=:status1 OR e.status=:status2)");
                query.setParameter("evaluation", evaluation);
                query.setParameter("projectId", projectId);
                query.setParameter("status1", DConstants.HIT_STATUS_DONE);
                query.setParameter("status2", DConstants.HIT_STATUS_PRE_TAGGED);
                Long count = (Long)query.uniqueResult();
                transaction.commit();
                return count != null? count : 0;
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }
    }

    /**
     * Get project annotation(all type) count details by user or project or both
     * @param projectId
     * @param userId
     * @param status
     * @return
     */
    private long getCountForProjectByStatusAndUser(String projectId, String userId, String status, String inpDate, String inpEndDate) {
        Session session = sessionFactory.openSession();
        try {
            ManagedSessionContext.bind(session);
            org.hibernate.Transaction transaction = session.beginTransaction();
            try {
                Query query = null;

                // Define default query string
                String str = "select count(*) from DHits e where e.projectId=:projectId";

                // Adding conditional placeholder for annotation status by user id
                if (userId != null)
                    str += " AND statusByUid=:statusByUid";

                // Adding conditional placeholder for status
                if (status != null)
                    str += " AND e.status=:status";

                // Adding conditional placeholder for date (inpDate)
                if (inpDate != null)
                    str += " AND e.updated_timestamp>=:updated_timestamp_s";

                // Adding conditional placeholder for end date (inpEndDate)
                if (inpEndDate != null)
                    str += " AND e.updated_timestamp<=:updated_timestamp_e";

                // System.out.println("==========================");
                // System.out.println("Query String ==> " + str);

                query = session.createQuery(str);

                // Setting base parameter
                query.setParameter("projectId", projectId);

                // Setting conditional parameter for annotation status by user id
                if (userId != null)
                    query.setParameter("statusByUid", userId);

                // Setting conditional parameter for status
                if (status != null)
                    query.setParameter("status", status);

                // Common pre-requisites for date (inpDate or inpEndDate or both)
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

                // Setting conditional parameter for date (inpDate)
                if (inpDate != null) {
                    String inpDate_s = inpDate + " 00:00:00";

                    System.out.println("inpDate_s ==> " + inpDate_s);

                    Date parsedDate_s = dateFormat.parse(inpDate_s);
                    Timestamp timestamp_s = new java.sql.Timestamp(parsedDate_s.getTime());

                    System.out.println("parsedDate_s ==> " + parsedDate_s);
                    System.out.println("timestamp_s ==> " + timestamp_s);

                    query.setParameter("updated_timestamp_s", timestamp_s);
                }

                // Setting conditional parameter for end date (inpDate)
                if (inpEndDate != null) {
                    String inpDate_e = inpEndDate + " 23:59:59";

                    System.out.println("inpDate_e ==> " + inpDate_e);

                    Date parsedDate_e = dateFormat.parse(inpDate_e);
                    Timestamp timestamp_e = new java.sql.Timestamp(parsedDate_e.getTime());

                    System.out.println("parsedDate_e ==> " + parsedDate_e);
                    System.out.println("timestamp_e ==> " + timestamp_e);

                    query.setParameter("updated_timestamp_e", timestamp_e);
                }

                Long count = (Long)query.uniqueResult();
                transaction.commit();
                Long finalCount = count != null? count : 0;

                // System.out.println("Curr " + status + " count ==>" + finalCount);
                // System.out.println("projectId ==>" + projectId);
                // System.out.println("statusByUid ==>" + userId);
                // System.out.println("status ==>" + status);
                // System.out.println("==========================");

                return finalCount;
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }
    }
    
    /**
     * Get project evaluation details by user or project or both
     * 
     * @param projectId
     * @param evaluation
     * @return count
     */
    private long getCountForProjectByEvaluationDetailsAndUser(String projectId, String userId, DTypes.HIT_Evaluation_Type evaluation, String inpDate, String inpEndDate) {
        Session session = sessionFactory.openSession();
        try {
            ManagedSessionContext.bind(session);
            org.hibernate.Transaction transaction = session.beginTransaction();
            try {
                Query query = null;

                // Define default query string
                String str = "select count(*) from DHits e where e.projectId=:projectId AND e.evaluation=:evaluation" +
                        " AND (e.status=:status1 OR e.status=:status2)";

                // Adding conditional placeholder for evaluated by user id
                if (userId != null)
                    str += " AND e.evaluatedByUid=:evaluatedByUid";

                // Adding conditional placeholder for date (inpDate)
                if (inpDate != null)
                    str += " AND e.updated_timestamp_eval>=:updated_timestamp_eval_s";

                // Adding conditional placeholder for end date (inpEndDate)
                if (inpEndDate != null)
                    str += " AND e.updated_timestamp_eval<=:updated_timestamp_eval_e";


                // System.out.println("==========================");
                // System.out.println("Query String ==> " + str);

                query = session.createQuery(str);

                // Setting conditional parameter for evaluated by user id
                if (userId != null)
                    query.setParameter("evaluatedByUid", userId);

                // Common pre-requisites for date (inpDate or inpEndDate or both)
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

                // Setting conditional parameter for date (inpDate)
                if (inpDate != null) {
                    String inpDate_s = inpDate + " 00:00:00";

                    // System.out.println("inpDate_s ==> " + inpDate_s);

                    Date parsedDate_s = dateFormat.parse(inpDate_s);
                    Timestamp timestamp_s = new java.sql.Timestamp(parsedDate_s.getTime());

                    // System.out.println("parsedDate_s ==> " + parsedDate_s);
                    // System.out.println("timestamp_s ==> " + timestamp_s);

                    query.setParameter("updated_timestamp_eval_s", timestamp_s);
                }

                // Setting conditional parameter for end date (inpEndDate)
                if (inpEndDate != null) {
                    String inpDate_e = inpEndDate + " 23:59:59";

                    // System.out.println("inpDate_e ==> " + inpDate_e);

                    Date parsedDate_e = dateFormat.parse(inpDate_e);
                    Timestamp timestamp_e = new java.sql.Timestamp(parsedDate_e.getTime());

                    // System.out.println("parsedDate_e ==> " + parsedDate_e);
                    // System.out.println("timestamp_e ==> " + timestamp_e);

                    query.setParameter("updated_timestamp_eval_e", timestamp_e);
                }

                query.setParameter("evaluation", evaluation);
                query.setParameter("projectId", projectId);                

                query.setParameter("status1", DConstants.HIT_STATUS_DONE);
                query.setParameter("status2", DConstants.HIT_STATUS_PRE_TAGGED);
                Long count = (Long)query.uniqueResult();
                transaction.commit();
                return count != null? count : 0;
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }
    }

    public long getCountForProject(String projectId) {
        return getCountForProjectForStatus(projectId, null);
    }

    public long getCountForProjectDone(String projectId) {
        return getCountForProjectForStatus(projectId, DConstants.HIT_STATUS_DONE);
    }

    public long getCountForProjectSkipped(String projectId) {
        return getCountForProjectForStatus(projectId, DConstants.HIT_STATUS_SKIPPED);
    }

    public long getCountForProjectDeleted(String projectId) {
        return getCountForProjectForStatus(projectId, DConstants.HIT_STATUS_DELETED);
    }


    public long getCountForProjectEvaluationCorrect(String projectId) {
        return getCountForProjectForEvaluation(projectId, DTypes.HIT_Evaluation_Type.CORRECT);
    }

    public long getCountForProjectEvaluationInCorrect(String projectId) {
        return getCountForProjectForEvaluation(projectId, DTypes.HIT_Evaluation_Type.INCORRECT);
    }

    /**
     * This function gets the count for different annotation done by specific users
     * E.g. how many tasks has been deleted or skipped or marked hit or marked requeued 
     * by an user for a particular project
     * 
     * @param projectId
     * @param userId
     * @param currAnnotationType
     * @param inpDate
     * @param inpEndDate
     * @return
     */
    public long getCountForProjectAnnotationType(String projectId, String userId, String currAnnotationType, String inpDate, String inpEndDate) {
        return getCountForProjectByStatusAndUser(projectId, userId, currAnnotationType, inpDate, inpEndDate);
    }

    /**
     * This function gets the count for correct and incorrect evaluation done by specific user
     * for a particular project
     * 
     * @param projectId
     * @param userId
     * @param currEvaluation
     * @param inpDate
     * @param inpEndDate
     * @return
     */
    public long getCountForProjectEvaluationDetailsByUser(String projectId, String userId, DTypes.HIT_Evaluation_Type currEvaluation, String inpDate, String inpEndDate) {
        return getCountForProjectByEvaluationDetailsAndUser(projectId, userId, currEvaluation, inpDate, inpEndDate);
    }

    // get count rows for tagging from the project selected randomly.
    // using randomly so that two users are not returned the same hit to be tagged.
    public List<DHits> getUndoneRandomlyInternal(String projectId, String status, long count) {
        String query = "FROM DHits where projectId = :projectId AND status = :status";
        return getInternal(query, projectId, status, null,0, count, DTypes.HIT_ORDER_Type.RANDOM);
    }

    public List<DHits> getUndoneInternal(String projectId, String status, long count, DTypes.HIT_ORDER_Type orderBy) {
        return getInternal(projectId, 0, count, status, orderBy);
    }

    //with evaluation filtering.
    public List<DHits> getInternal(String projectId, long start, long count, String status, String evaluation, DTypes.HIT_ORDER_Type orderBy) {
        String query = "FROM DHits where projectId = :projectId AND evaluation = :evaluation";
        if (status != null) {
            query = "FROM DHits where projectId = :projectId AND status = :status AND evaluation = :evaluation";
        }
        return getInternal(query, projectId, status, evaluation,  start, count, orderBy);
    }

    public List<DHits> getInternal(String projectId, long start, long count, String status) {
        return getInternal(projectId, start, count, status,  DTypes.HIT_ORDER_Type.NONE);
    }

    public List<DHits> getInternal(String projectId, long start, long count, String status, DTypes.HIT_ORDER_Type orderBy) {
        String query = "FROM DHits where projectId = :projectId";
        if (status != null) {
            query = "FROM DHits where projectId = :projectId AND status = :status";
        }
        return getInternal(query, projectId, status, null, start, count, orderBy);
    }

    private List<DHits> getInternal(String HQLQuery, String projectId, String status, String evaluation, long start, long count, DTypes.HIT_ORDER_Type orderBy) {
        Session session = sessionFactory.openSession();
        try {
            ManagedSessionContext.bind(session);
            org.hibernate.Transaction transaction = session.beginTransaction();
            try {
                String orderByString = " ORDER BY ";
                if (orderBy == DTypes.HIT_ORDER_Type.RANDOM) {
                    orderByString += "RAND()";
                }
                if (orderBy == DTypes.HIT_ORDER_Type.NEW_FIRST) {
                    orderByString += "updated_timestamp DESC";
                }
                if (orderBy == DTypes.HIT_ORDER_Type.OLD_FIRST) {
                    orderByString += "updated_timestamp ASC";
                }
                if (orderBy == DTypes.HIT_ORDER_Type.NONE) {
                    orderByString = "";
                }

                HQLQuery += orderByString;

                Query query = session.createQuery(HQLQuery);
                query.setParameter("projectId", projectId);
                if (status != null) {
                    query.setParameter("status", status);
                }
                if (evaluation != null) {
                    query.setParameter("evaluation", DTypes.HIT_Evaluation_Type.valueOf(evaluation));
                }
                query.setFirstResult((int)start);
                query.setMaxResults((int)count);
                List<DHits> list = query.list();
                transaction.commit();
                return list;
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }
    }

    public void deleteByProjectId(String projectId) {
        Session session = sessionFactory.openSession();
        try {
            String HQLQuery = "DELETE DHits where projectId = :projectId";
            ManagedSessionContext.bind(session);
            org.hibernate.Transaction transaction = session.beginTransaction();
            try {
                Query query = session.createQuery(HQLQuery);
                query.setParameter("projectId", projectId);
                query.executeUpdate();
                transaction.commit();
            }
            catch (Exception e) {
                transaction.rollback();
                throw new RuntimeException(e);
            }
        }
        finally {
            session.close();
            ManagedSessionContext.unbind(sessionFactory);
        }
    }



}



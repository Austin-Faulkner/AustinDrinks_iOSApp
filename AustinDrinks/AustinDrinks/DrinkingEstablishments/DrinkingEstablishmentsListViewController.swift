//
//  DrinkingEstablishmentsListViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/2/22.
//

import UIKit

class DrinkingEstablishmentsListViewController: UIViewController, UICollectionViewDelegate {
    
    private let manager = EstablishmentDataManager()
    
    var selectedEstablishment: EstablishmentItem? // Allows for establishment selection on Drinking Establishments
                                                  // List View page such that a delegate (a segue) can allow for a
                                                  // transition from the Establishment List View to the Establishment Detail View.
    var selectedCity: LocationItem? // City selected from Explore PATH
    var selectedTags: String? // Type of craft-beverage selected on Explore Path
    
    @IBOutlet var collectionView: UICollectionView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let identifier = segue.identifier {
            switch identifier {
            case Segue.showDetail.rawValue:
                showEstablishmentDetail(segue: segue)
            default:
                print("Segue not added.")
            }
        }
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        initialize()
    }

    // TODO: moded feature of the List View for establishments; 'GO' moved to Establishment Detail View, and is renamed 'Website'.
    @IBAction func goButton(_ sender: UIButton) {
        UIApplication.shared.open(URL(string: "https://www.hackerrank.com/")! as URL, options: [:], completionHandler: nil)
    }
}

// MARK: Private Extension
private extension DrinkingEstablishmentsListViewController {
    func initialize() {
        createData()
        setupTitle()
        setupCollectionView()
    }
    
    // List View Flow properties
    func setupCollectionView() {
        let flow = UICollectionViewFlowLayout()
        flow.sectionInset = UIEdgeInsets(top: 7, left: 7, bottom: 7, right: 7)
        flow.minimumInteritemSpacing = 0
        flow.minimumLineSpacing = 7
        collectionView.collectionViewLayout = flow
    }
    
    func showEstablishmentDetail(segue: UIStoryboardSegue) {
        if let viewController = segue.destination as? EstablishmentDetailViewController,
           let indexPath = collectionView.indexPathsForSelectedItems?.first {
            selectedEstablishment = manager.establishmentItem(at: indexPath.row)
            viewController.selectedEstablishment = selectedEstablishment
        }
    }
    
    func createData() {
        guard let city = selectedCity?.city,
              let tag = selectedTags else {
                  return
              }
        manager.fetch(location: city, selectedEthanol: tag) {
            establishmentItems in
            if !establishmentItems.isEmpty {
                collectionView.backgroundView = nil
            } else {
                let view = NoDataView(frame: CGRect(x: 0, y: 0, width: collectionView.frame.width, height: collectionView.frame.height))
                view.set(title: "Drinking Establishments", desc: "No establishments found.", accomm: "No accommodations found.", rating: "0.0", count: "0")
                collectionView.backgroundView = view
            }
            collectionView.reloadData()
        }
    }
    
    func setupTitle() {
        navigationController?.setNavigationBarHidden(false, animated: false)
        title = selectedCity?.cityAndState 
        navigationController?.navigationBar.prefersLargeTitles = true
    }
}

extension DrinkingEstablishmentsListViewController: UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        var columns: CGFloat = 1
        if Device.isPad {
            columns = 2
        } else {
            columns = traitCollection.horizontalSizeClass == .compact ? 1 : 2
        }
        let viewWidth = collectionView.frame.size.width
        let inset = 9.0
        let contentWidth = viewWidth - inset * (columns + 1)
        let cellWidth = contentWidth / columns
        let cellHeigth = 312.0
        return CGSize(width: cellWidth, height: cellHeigth)
    }
}

// MARK:: UIColletionViewDataSource
extension DrinkingEstablishmentsListViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        manager.numberOfEstablishmentItems()
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "establishmentCell", for: indexPath) as! DrinkingEstablishmentCell
        let establishmentItem = manager.establishmentItem(at: indexPath.row)
        cell.titleLabel.text = establishmentItem.name
        if let tag = establishmentItem.subtitle {
            cell.tagLabel.text = tag
        }
        
        if let accommodation = establishmentItem.accommodation_attributes {
            cell.accommodationsLabel.text = accommodation
        }
        cell.ratingLabel.text = establishmentItem.rating_value
        cell.countLabel.text = establishmentItem.rating_count
        return cell
    }
}


